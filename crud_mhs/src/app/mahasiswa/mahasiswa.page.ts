import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any[] = [];
  modalTambah: boolean = false;
  modalEdit: boolean = false;
  id: any;
  nama: string = '';
  jurusan: string = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getMahasiswa();
  }

  // Fetch Mahasiswa data
  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('Data mahasiswa fetched successfully', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log('Error fetching mahasiswa data', err);
      }
    });
  }

  // Reset modal data
  resetModal() {
    this.id = null;
    this.nama = '';
    this.jurusan = '';
  }

  // Open the Add Modal
  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    if (isOpen) {
      this.resetModal();
    }
  }

  // Cancel modal
  cancel() {
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  // Add a new mahasiswa
  tambahMahasiswa() {
    if (this.nama !== '' && this.jurusan !== '') {
      let data = {
        nama: this.nama,
        jurusan: this.jurusan
      };

      this.api.tambah(data, 'tambah.php').subscribe({
        next: (res: any) => {
          console.log('Mahasiswa added successfully');
          this.resetModal();
          this.getMahasiswa();
          this.modalTambah = false;
        },
        error: (err: any) => {
          console.log('Failed to add mahasiswa', err);
        }
      });
    } else {
      console.log('Failed to add mahasiswa due to empty fields');
    }
  }

  // Delete a mahasiswa
  hapusMahasiswa(id: any) {
    console.log('Menghapus mahasiswa dengan ID:', id);  // Menambahkan log untuk memastikan ID yang dikirim
    this.api.hapus(id, 'hapus.php').subscribe({
      next: (res: any) => {
        console.log('Mahasiswa deleted successfully');
        this.getMahasiswa();
      },
      error: (err: any) => {
        console.log('Failed to delete mahasiswa', err);
      }
    });
  }
  
  // Get details of a mahasiswa for editing
  ambilMahasiswa(id: any) {
    this.api.lihat(id, 'lihat.php').subscribe({
      next: (res: any) => {
        console.log('Mahasiswa details fetched successfully', res);
        this.id = res.id;
        this.nama = res.nama;
        this.jurusan = res.jurusan;
      },
      error: (err: any) => {
        console.log('Failed to fetch mahasiswa details', err);
      }
    });
  }

  // Open the Edit Modal and fetch data for editing
  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    if (isOpen) {
      this.id = idget;
      console.log('Opening edit modal for mahasiswa with ID:', this.id);
      this.ambilMahasiswa(this.id);
    }
  }

  // Edit an existing mahasiswa
// Add this to your editMahasiswa method to check if the ID and form data are being passed correctly
editMahasiswa() {
  if (this.nama && this.jurusan && this.id) {
    let data = {
      id: this.id,
      nama: this.nama,
      jurusan: this.jurusan
    };

    this.api.edit(data, 'edit.php').subscribe({
      next: (res: any) => {
        console.log('Mahasiswa edited successfully');
        this.resetModal();
        this.getMahasiswa();
        this.modalEdit = false;
      },
      error: (err: any) => {
        console.log('Failed to edit mahasiswa', err);
      }
    });
  } else {
    console.log('Invalid data for editing');
  }
}
}
