import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { Badge } from 'src/app/Models/badge';
import { BadgeService } from 'src/app/Service/BadgeService/BadgeService/badge-service.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit {
  badges!: any[];
  selectedBadge: Badge = { id: 0, userId: 0, username: '', matricule: '', status: '', photos: '', user: { email: '', username: '' } };

  constructor(private badgeService: BadgeService,private tokenStorage: TokenStorageService) { }
  ngOnInit(): void {
    this.fetchBadges();
  }
  openUpdateModal(badge: Badge) {
    this.selectedBadge = badge;
    // Show modal using jQuery since Bootstrap 5 doesn't include JavaScript by default
    $('#exampleModal').modal('show');
}
  fetchBadges(): void {
    const authToken = this.tokenStorage.getToken(); // Retrieve the authorization token from local storage
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');

      return;
    }
    console.log(authToken);
    this.badgeService.getAllBadges(authToken)
      .subscribe(
        data => {
          console.log(data)
          this.badges = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  acceptBadge(badgeId: number, username: string): void {
    const authToken = this.tokenStorage.getToken(); // Retrieve the authorization token from local storage
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');

      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to accept the badge for ${username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Accept'
    }).then((result) => {
      if (result.isConfirmed) {
        this.badgeService.acceptBadge(badgeId , authToken).subscribe(() => {
          Swal.fire('Success!', 'Badge accepted successfully!', 'success');
          this.ngOnInit();
          // Reload badges or update the badge list as needed
        }, (error: any) => {
          Swal.fire('Error!', 'Failed to accept badge!', 'error');
        });
      }
    });
  }

  refuseBadge(badgeId: number, username: string): void {
    const authToken = this.tokenStorage.getToken(); // Retrieve the authorization token from local storage
    if (!authToken) {
      console.error('Authorization token not found');
      Swal.fire('Error!', 'Authorization token not found', 'error');

      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to refuse the badge for ${username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Refuse'
    }).then((result) => {
      if (result.isConfirmed) {
        this.badgeService.refuseBadge(badgeId, authToken).subscribe(() => {
          Swal.fire('Success!', 'Badge refused successfully!', 'success');
          this.ngOnInit();

          // Reload badges or update the badge list as needed
        }, (error: any) => {
          Swal.fire('Error!', 'Failed to refuse badge!', 'error');
        });
      }
    });
  }

  updateBadge(): void {
    if (!this.selectedBadge || !this.selectedBadge.user) {
        console.error('Selected badge or user is undefined.');
        return;
    }

    const badgeId = this.selectedBadge.id;
    const newUsername = this.selectedBadge.user?.username;
    const newMatricule = this.selectedBadge.matricule;

    // Call your service method to update the badge
    this.badgeService.updateBadge(badgeId, newUsername, newMatricule).subscribe(
        (response: any) => {
            // If successful, update the badge list
            this.fetchBadges();
            // Show a success message using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Badge updated successfully.'
            });
            // Close the modal
            $('#exampleModal').modal('hide');
        },
        (error: any) => {
            console.error('Error updating badge:', error);
            // Show an error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error updating badge. Please try again later.'
            });
        }
    );
}




}
