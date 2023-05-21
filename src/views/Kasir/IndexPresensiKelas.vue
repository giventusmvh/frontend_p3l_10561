<template>
  <nav class="navbar navbar-dark navbar-expand-lg bg-dark sticky-top shadow text-light">
    <div class="container">
      <a class="navbar-brand" href="#"> Logged In as Kasir </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Action </a>
            <ul class="dropdown-menu">
              <li><router-link :to="{ name: 'kasirhome' }" class="dropdown-item">Data Member</router-link></li>
              <li><router-link :to="{ name: 'aktivasi' }" class="dropdown-item">T. Aktivasi</router-link></li>
              <li><router-link :to="{ name: 'deporeguler' }" class="dropdown-item">T. Uang Reguler</router-link></li>
              <li><router-link :to="{ name: 'depokelas' }" class="dropdown-item">T. Deposit Kelas</router-link></li>
              <li><router-link :to="{ name: 'listMexp' }" class="dropdown-item">Sistem - Member Exp</router-link></li>
              <li><router-link :to="{ name: 'listDexp' }" class="dropdown-item">Sistem - Depo Exp</router-link></li>
              <li><router-link :to="{ name: 'indexgym' }" class="dropdown-item">Presensi Gym</router-link></li>
              <li><router-link :to="{ name: 'indexPresensiKls' }" class="dropdown-item">Presensi Kelas</router-link></li>
              <li><hr class="dropdown-divider" /></li>
              <li class="nav-item" style="text-align: center">
                <button class="btn btn-outline-danger" @click="logout">Logout</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">LIST PRESENSI KELAS HARI INI</h1>
  </div>
  <div class="mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <div class="row"></div>
            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">NO BOOKING</th>
                  <th scope="col">NAMA MEMBER</th>
                  <th scope="col">KELAS</th>
                  <th scope="col">TANGGAL BOOKING</th>
                  <th scope="col">WAKTU PRESENSI</th>
                  <th scope="col">TIPE BOOKING</th>
                  <th scope="col">STATUS</th>
                  <th scope="col">CETAK STRUK</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(pkls, id) in pkelass" :key="id">
                  <td>{{ pkls.no_booking }}</td>
                  <td>{{ pkls.nama_member }}</td>
                  <td>{{ pkls.nama_kelas }}</td>
                  <td>{{ pkls.tanggal }}</td>
                  <td>{{ pkls.waktu_presensi_kelas }}</td>
                  <td v-if="pkls.id_depositKelasM">Paket</td>
                  <td v-else>Reguler</td>
                  <td v-if="pkls.status_presensi === 1">Hadir</td>
                  <td v-else>Tidak Hadir</td>
                  <td v-if="pkls.id_depositKelasM === null">
                    <button class="btn btn-sm btn-success m-1" @click="generateRegPdf(pkls.id, pkls.id_member, pkls.id_kelas, pkls.id_instruktur)"><i class="bi bi-filetype-pdf"></i></button>
                  </td>
                  <td v-else>
                    <button class="btn btn-sm btn-success m-1" @click="generatePaketPdf(pkls.id, pkls.id_member, pkls.id_kelas, pkls.id_instruktur, pkls.id_depositKelasM)"><i class="bi bi-filetype-pdf"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
//
<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { onMounted, ref } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { createToaster } from "@meforma/vue-toaster";

export default {
  setup() {
    // const toaster = createToaster({
    //   position: "top-right",
    //   duration: 2000,
    // });
    //reactive state

    let pkelass = ref([]);
    let members = ref([]);
    const pkls = reactive({
      id: "",
    });

    //state validation
    // const validation = ref([]);
    const router = useRouter();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    //mounted
    onMounted(() => {
      if (!token) {
        router.push({
          name: "Login",
        });
      } else if (role !== "kasir") {
        logout();
      }
      //get API from Laravel Backend
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("http://127.0.0.1:8000/api/presensiKelas/show")
        .then((response) => {
          //assign state posts with response data
          pkelass.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    function generateRegPdf(id1, id2, id3, id4) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .all([
          axios.get(`http://127.0.0.1:8000/api/bookingKelas/showByID/${id1}`, {}),
          axios.get(`http://127.0.0.1:8000/api/user/${id2}`, {}),
          axios.get(`http://127.0.0.1:8000/api/kelas/${id3}`, {}),
          axios.get(`http://127.0.0.1:8000/api/instruktur/${id4}`, {}),
        ])
        .then(
          axios.spread((res1, res2, res3, res4) => {
            const now = new Date();
            this.pkls = res1.data.data;
            this.member = res2.data.data;
            this.kelas = res3.data.data;
            this.instruktur = res4.data.data;
            this.currentTime = now.toLocaleTimeString();
            // Create a new PDF document
            var doc = new jsPDF();
            const now2 = new Date();
            this.currentDate = now2.toLocaleDateString();
            // Define the position and size of the card
            var cardX = 10;
            var cardY = 10;
            var cardWidth = 150;
            var cardHeight = 115;

            // Draw the card border
            doc.rect(cardX, cardY, cardWidth, cardHeight);

            // Write the member data inside the card
            doc.text("---STRUK PRESENSI KELAS REGULER---", cardX + 30, cardY + 7);
            doc.text("GoFit", cardX + 5, cardY + 15);
            doc.text("Jl.Central Park No.10 Yogyakarta ", cardX + 5, cardY + 25);
            doc.text("-------------------------", cardX + 5, cardY + 35);
            doc.text("No Booking: " + this.pkls.no_booking, cardX + 5, cardY + 45);
            doc.text("Tanggal: " + this.currentDate + "   " + this.currentTime, cardX + 5, cardY + 55);
            doc.text("ID / Member: " + this.member.id_member + "/" + this.member.nama_member, cardX + 5, cardY + 65);
            doc.text("Kelas: " + this.kelas.nama_kelas, cardX + 5, cardY + 75);
            doc.text("Instruktur: " + this.instruktur.nama_instruktur, cardX + 5, cardY + 85);
            doc.text("Tarif: " + this.kelas.harga_kelas, cardX + 5, cardY + 95);
            doc.text("Sisa Deposit: " + this.member.deposit_uang_member, cardX + 5, cardY + 105);

            // Download the PDF
            doc.save("strukPresensiKelasReguler.pdf");
          })
        )
        .catch((error) => {
          console.log(error);
        });
    }

    function generatePaketPdf(id1, id2, id3, id4, id5) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .all([
          axios.get(`http://127.0.0.1:8000/api/bookingKelas/showByID/${id1}`, {}),
          axios.get(`http://127.0.0.1:8000/api/user/${id2}`, {}),
          axios.get(`http://127.0.0.1:8000/api/kelas/${id3}`, {}),
          axios.get(`http://127.0.0.1:8000/api/instruktur/${id4}`, {}),
          axios.get(`http://127.0.0.1:8000/api/depositKelas/${id5}`, {}),
        ])
        .then(
          axios.spread((res1, res2, res3, res4, res5) => {
            const now = new Date();
            this.pkls = res1.data.data;
            this.member = res2.data.data;
            this.kelas = res3.data.data;
            this.instruktur = res4.data.data;
            this.depo = res5.data.data;
            this.currentTime = now.toLocaleTimeString();
            // Create a new PDF document
            var doc = new jsPDF();
            const now2 = new Date();
            this.currentDate = now2.toLocaleDateString();

            // Define the position and size of the card
            var cardX = 10;
            var cardY = 10;
            var cardWidth = 150;
            var cardHeight = 115;

            // Draw the card border
            doc.rect(cardX, cardY, cardWidth, cardHeight);

            // Write the member data inside the card
            doc.text("---STRUK PRESENSI KELAS PAKET---", cardX + 30, cardY + 7);
            doc.text("GoFit", cardX + 5, cardY + 15);
            doc.text("Jl.Central Park No.10 Yogyakarta ", cardX + 5, cardY + 25);
            doc.text("-------------------------", cardX + 5, cardY + 35);
            doc.text("No Booking: " + this.pkls.no_booking, cardX + 5, cardY + 45);
            doc.text("Tanggal: " + this.currentDate + "   " + this.currentTime, cardX + 5, cardY + 55);
            doc.text("ID / Member: " + this.member.id_member + "/" + this.member.nama_member, cardX + 5, cardY + 65);
            doc.text("Kelas: " + this.kelas.nama_kelas, cardX + 5, cardY + 75);
            doc.text("Instruktur: " + this.instruktur.nama_instruktur, cardX + 5, cardY + 85);
            doc.text("Sisa Deposit: " + this.depo.sisa_depositK, cardX + 5, cardY + 95);
            doc.text("Masa Berlaku: " + this.depo.masa_berlaku_depositK, cardX + 5, cardY + 105);

            // Download the PDF
            doc.save("strukDepositKelasPaket.pdf");
          })
        )
        .catch((error) => {
          console.log(error);
        });
    }
    function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      localStorage.removeItem("id_pegawai");
      localStorage.removeItem("nama_pegawai");
      localStorage.removeItem("email");
      router.push({
        name: "Login",
      });
    }

    //return
    return {
      pkelass,
      members,
      logout,

      generateRegPdf,
      generatePaketPdf,
      pkls,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}
@media (max-width: 768px) {
  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .table {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-collapse: collapse;
    border-spacing: 0;
  }
  .table thead {
    display: none;
  }
  .table tbody {
    display: block;
    width: 100%;
  }
  .table tbody tr {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .table tbody td {
    display: block;
    text-align: right;
    font-size: 13px;
    border-bottom: none;
    position: relative;
    padding-left: 50%;
    text-align: right;
  }
  .table tbody td:before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>
