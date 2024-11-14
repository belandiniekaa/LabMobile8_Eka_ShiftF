import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mahasiswa',
  templateUrl: './mahasiswa.page.html',
  styleUrls: ['./mahasiswa.page.scss'],
})
export class MahasiswaPage implements OnInit {
  dataMahasiswa: any;
  modalTambah: boolean = false;
  modalEdit: boolean = false;
  id: any;
  nama: string = '';
  jurusan: string = '';

  constructor(
    private api: ApiService,
    private modal: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getMahasiswa();
  }

  getMahasiswa() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMahasiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  resetModal() {
    this.id = null;
    this.nama = '';
    this.jurusan = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    this.ambilMahasiswa(this.id);
  }

  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  tambahMahasiswa() {
    if (this.nama && this.jurusan) {
      let data = { nama: this.nama, jurusan: this.jurusan };
      this.api.tambah(data, 'tambah.php').subscribe({
        next: (hasil: any) => {
          console.log('berhasil tambah mahasiswa');
          this.resetModal();
          this.getMahasiswa();
          this.modal.dismiss();
        },
        error: () => {
          console.log('gagal tambah mahasiswa');
        },
      });
    } else {
      console.log('gagal tambah mahasiswa karena masih ada data yg kosong');
    }
  }

  async confirmDelete(id: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Hapus',
      message: 'Apakah data ingin dihapus?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Hapus dibatalkan');
          },
        },
        {
          text: 'Ya',
          handler: () => {
            this.hapusMahasiswa(id);
          },
        },
      ],
    });
    await alert.present();
  }

  hapusMahasiswa(id: any) {
    this.api.hapus(id, 'hapus.php?id=').subscribe({
      next: () => {
        console.log('berhasil hapus data');
        this.getMahasiswa();
      },
      error: () => {
        console.log('gagal hapus data');
      },
    });
  }

  ambilMahasiswa(id: any) {
    this.api.lihat(id, 'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        this.id = hasil.id;
        this.nama = hasil.nama;
        this.jurusan = hasil.jurusan;
      },
      error: () => {
        console.log('gagal ambil data');
      },
    });
  }

  editMahasiswa() {
    let data = { id: this.id, nama: this.nama, jurusan: this.jurusan };
    this.api.edit(data, 'edit.php').subscribe({
      next: () => {
        console.log('berhasil edit Mahasiswa');
        this.resetModal();
        this.getMahasiswa();
        this.modal.dismiss();
      },
      error: () => {
        console.log('gagal edit Mahasiswa');
      },
    });
  }
}
