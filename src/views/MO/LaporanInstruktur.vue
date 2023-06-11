<template>
  <nav class="navbar navbar-dark navbar-expand-lg bg-dark sticky-top shadow text-light">
    <div class="container">
      <a class="navbar-brand" href="#"> Logged In as Manager Operasional </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Action </a>
            <ul class="dropdown-menu">
              <li><router-link :to="{ name: 'mohome' }" class="dropdown-item">Jadwal Umum</router-link></li>
              <li><router-link :to="{ name: 'jadwalHarian' }" class="dropdown-item">Jadwal Harian</router-link></li>
              <li><router-link :to="{ name: 'perizinan' }" class="dropdown-item">Perizinan Instruktur</router-link></li>
              <li><router-link :to="{ name: 'laporanInstruktur' }" class="dropdown-item">Laporan Instruktur</router-link></li>
              <li><router-link :to="{ name: 'laporanGym' }" class="dropdown-item">Laporan Gym</router-link></li>
              <li><router-link :to="{ name: 'laporanKelas' }" class="dropdown-item">Laporan Kelas</router-link></li>
              <li><router-link :to="{ name: 'laporanPendapatan' }" class="dropdown-item">Laporan Pendapatan</router-link></li>
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
    <h1 class="h2">Laporan Instruktur Bulanan</h1>
  </div>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <!-- <router-link :to="{ name: 'addlaporan' }" class="btn btn-md btn-success shadow">TAMBAH INSTRUKTUR</router-link> -->
            <button class="btn btn-success m-1" @click="generatePdf()">Cetak Laporan</button>
            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">NAMA INSTRUKTUR</th>
                  <th scope="col">JUMLAH KEHADIRAN</th>
                  <th scope="col">JUMLAH KETIDAKHADIRAN</th>
                  <th scope="col">AKUMULASI KETERLAMBATAN</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(laporan, id) in laporans" :key="id">
                  <td>{{ laporan.nama_instruktur }}</td>
                  <td>{{ laporan.total_kehadiran }}</td>
                  <td>{{ laporan.total_ketidakhadiran }}</td>
                  <td>{{ laporan.akumulasi_terlambat }} detik</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Button trigger modal -->
</template>
//
<script>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default {
  setup() {
    //reactive state
    let laporans = ref([]);
    const laporan = reactive({
      id: "",
      nama_instruktur: "",
    });
    //state validation

    const router = useRouter();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    //mounted
    onMounted(() => {
      if (!token) {
        router.push({
          name: "Login",
        });
      } else if (role !== "manager") {
        logout();
      }
      //get API from Laravel Backend
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("https://api.gofit.given.website/api/jumlahInstruktur")
        .then((response) => {
          //assign state posts with response data
          laporans.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
    function generatePdf() {
      const doc = new jsPDF();
      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "long" });
      const year = currentDate.getFullYear();
      const date = currentDate.getDate();

      const reportTitle = "LAPORAN INSTRUKTUR BULANAN";
      const reportSubtitle = `BULAN: ${month}   TAHUN: ${year}`;
      const reportSubtitle2 = `TGL CETAK: ${date} ${month} ${year}`;

      // Generate PDF content
      const table = document.querySelector(".table");
      html2canvas(table).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 185;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 15;

        doc.setFontSize(18);
        doc.text(reportTitle, 15, position);
        position += 10;
        doc.setFontSize(12);
        doc.text(reportSubtitle, 15, position);
        position += 10;
        doc.setFontSize(12);
        doc.text(reportSubtitle2, 15, position);
        position += 20;
        doc.addImage(imgData, "PNG", 15, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - position + 10;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 15, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Save the PDF
        doc.save("laporan_instruktur_bulanan.pdf");
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
      laporans,
      laporan,
      generatePdf,
      logout,
      selectedInstrukturId: null,
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
