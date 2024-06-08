import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttestationServiceService } from 'src/app/Service/AttestationService/attestation-service.service';
import { ScriptStyleLoaderService } from 'src/app/Service/ScriptStyleLoaderService/script-style-loader-service.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BadgeService } from 'src/app/Service/BadgeService/BadgeService/badge-service.service';
import { DemandeAttestations } from 'src/app/Models/DemandeAttestations';
import { DemandeAttestationsService } from 'src/app/Service/DemandeAttestations/demande-attestations.service';
import { User } from 'src/app/Models/User';
import { UsersService } from 'src/app/Service/users/users.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: any;
  role: any;
  attestations: any[] = [];
  badges: any[] = [];
  demandeAttestations: DemandeAttestations[] = [];
  users: User[] = [];

  public barChartData: ChartDataSets[] = [];
  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,123,255,0.5)',
    },
  ];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];
 // Properties for badges chart
 public badgeChartData: ChartDataSets[] = [];
 public badgeChartLabels: Label[] = [];
 public badgeChartOptions: ChartOptions = {
   responsive: true,
 };
 public badgeChartColors: Color[] = [
  {
    backgroundColor: ['rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'], // Green for Accepted, Red for Refused
  },
];

 public badgeChartLegend = true;
 public badgeChartType: ChartType = 'pie'; // Change the chart type to pie
 public badgeChartPlugins = [];

  // Properties for attestation demand chart
  public attestationDemandChartData: ChartDataSets[] = [];
  public attestationDemandChartLabels: Label[] = [];
  public attestationDemandChartOptions: ChartOptions = {
    responsive: true,
  };
  public attestationDemandChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: ['rgba(0, 255, 0, 0.5)', 'rgba(255, 0, 0, 0.5)'], // Green for Accepted, Red for Refused
    },
  ];
  public attestationDemandChartLegend = true;
  public attestationDemandChartType: ChartType = 'pie'; // Change the chart type to pie
  public attestationDemandChartPlugins = [];

  constructor(private userService: UsersService,private demandeAttestationsService: DemandeAttestationsService,private badgeService: BadgeService,private attestationService: AttestationServiceService ,private router:Router,private scriptStyleLoaderService: ScriptStyleLoaderService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      
      this.username = this.tokenStorage.getUser().username;
      this.role = this.tokenStorage.getUser().roles;

    }

    this.loadUsers();
    this.loadAttestations();
    this.fetchBadges();
    this.loadDemandeAttestations();
  


  }
  loadUsers() {
    // Set the auth token before fetching users
    const authToken = this.tokenStorage.getToken(); // Retrieve the authorization token from local storage
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');

      return;
    }
    this.userService.getAllUsers(authToken).subscribe(
      (data: User[]) => {
        this.users = data;
        console.log(this.users);
      },
      error => {
        console.log('Error fetching users:', error);
      }
    );
  }
  
  loadDemandeAttestations(): void {
    // Retrieve the authorization token from local storage
    const authToken = this.tokenStorage.getToken();
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');
      return;
    }

    // Fetch demande attestations using the service
    this.demandeAttestationsService.getAllDemandeAttestations(authToken).subscribe(
      (data: DemandeAttestations[]) => {
        this.demandeAttestations = data;
        console.log(this.demandeAttestations);
        this.prepareAttestationDemandChartData(data);

      },
      error => {
        console.log('Error fetching demande attestations:', error);
      }
    );
  }
  prepareAttestationDemandChartData(data: DemandeAttestations[]): void {
    // Fetch users and attestations
    const authToken = this.tokenStorage.getToken();
  
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');
      return;
    }
  
    // Fetch users
    this.userService.getAllUsers(authToken).subscribe(
      (users: User[]) => {
        this.users = users;
        console.log('Users:', this.users); // Log users
  
        // Fetch attestations
        this.attestationService.getAllAttestations(authToken).subscribe(
          (attestations: any[]) => {
            this.attestations = attestations;
            console.log('Attestations:', this.attestations); // Log attestations
  
            // Count attestation demands per user
            const demandCountPerUser = data.reduce((acc, demand) => {
              console.log('Demand:', demand); // Log demand object
  
              const user = this.users.find(user => user.id === demand.user_id);
              const attestation = this.attestations.find(attestation => attestation.id === demand.attestation_id);
              console.log('User:', user);
              console.log('Attestation:', attestation);
  
              const userName = user ? user.username : 'Unknown';
              const attestationName = attestation ? attestation.name : 'Unknown';
  
              const label = `${userName} - ${attestationName}`;
              acc[label] = (acc[label] || 0) + 1;
              return acc;
            }, {} as { [key: string]: number });
  
            this.attestationDemandChartLabels = Object.keys(demandCountPerUser);
            this.attestationDemandChartData = [
              { data: Object.values(demandCountPerUser), label: 'Attestation Demands' }
            ];
          },
          error => {
            console.log('Error fetching attestations:', error);
            // Handle error fetching attestations
          }
        );
      },
      error => {
        console.log('Error fetching users:', error);
        // Handle error fetching users
      }
    );
  }
  
  
  
  
  fetchBadges(): void {
    const authToken = this.tokenStorage.getToken(); // Retrieve the authorization token from local storage
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');

      return;
    }
    this.badgeService.getAllBadges(authToken)
      .subscribe(
        data => {
         
          this.badges = data;
          this.prepareBadgeChartData(data);

          console.log("badge", this.badges);
        },
        error => {
          console.log(error);
        }
      );
  }

  prepareBadgeChartData(data: any[]): void {
    const acceptedBadges = data.filter(badge => badge.status === 'accepter');
    const refusedBadges = data.filter(badge => badge.status === 'refuser');
  
    const acceptedCount = acceptedBadges.length;
    const refusedCount = refusedBadges.length;
  
    this.badgeChartLabels = ['Accepted', 'Refused'];
    this.badgeChartData = [
      { data: [acceptedCount, refusedCount], label: 'Badges' }
    ];
  }
  
  
  loadAttestations(): void {
    const authToken = this.tokenStorage.getToken();

    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');
      return;
    }
  
    this.attestationService.getAllAttestations(authToken).subscribe(
      data => {
        this.attestations = data;
        this.prepareChartData(data);

      },
      error => {
        console.log(error);
      }
    );
  }
  prepareChartData(data: any[]): void {
    // Assuming you want to count attestations by name
    const attestationNames = data.map(attestation => attestation.name);
    const attestationCounts = attestationNames.reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.barChartLabels = Object.keys(attestationCounts);
    this.barChartData = [
      { data: Object.values(attestationCounts).map(count => count as number), label: 'Attestations' }
    ];
  }
}
