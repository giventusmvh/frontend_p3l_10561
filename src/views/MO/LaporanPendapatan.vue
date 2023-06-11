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
    <h1 class="h2">Laporan PENDAPATAN Bulanan</h1>
  </div>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <!-- <router-link :to="{ name: 'addlaporan' }" class="btn btn-md btn-success shadow">TAMBAH INSTRUKTUR</router-link> -->
            <button class="btn btn-success m-1" @click="generatePdf()">Cetak Laporan</button>
            <div class="chart-container">
              <canvas id="chart"></canvas>
            </div>
            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">BULAN</th>
                  <th scope="col">AKTIVASI</th>
                  <th scope="col">DEPOSIT UANG</th>
                  <th scope="col">DEPOSIT KELAS</th>
                  <th scope="col">TOTAL</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(laporan, id) in laporans" :key="id">
                  <td>{{ laporan.bulan }}</td>
                  <td>{{ laporan.total_aktivasi }}</td>
                  <td>{{ laporan.total_uang }}</td>
                  <td>{{ laporan.total_kelas }}</td>
                  <td>{{ laporan.total_transaksi }}</td>
                </tr>
                <tr v-for="(laporan2, id) in laporans2" :key="id">
                  <th scope="col">TOTAL</th>
                  <td style="font-weight: bold">{{ laporan2.totalAktivasis }}</td>
                  <td style="font-weight: bold">{{ laporan2.totalDepositUangs }}</td>
                  <td style="font-weight: bold">{{ laporan2.totalDepositKelass }}</td>
                  <td style="font-weight: bold">{{ laporan2.totalKeseluruhan }}</td>
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
import { onMounted, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Chart from "chart.js/auto";
// import html2pdf from "html2pdf.js";

export default {
  setup() {
    //reactive state
    let laporans = ref([]);
    const laporan = reactive({
      id: "",
      nama_instruktur: "",
    });
    let laporans2 = ref([]);
    const laporan2 = reactive({
      id: "",
      nama_instruktur: "",
    });
    //state validation
    let chartInstance = null;
    const router = useRouter();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    watch(laporans, () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      createChart();
    });
    //mounted
    onMounted(() => {
      if (!token) {
        router.push({
          name: "Login",
        });
      } else if (role !== "manager") {
        logout();
      }
      createChart();
      //get API from Laravel Backend
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("https://api.gofit.given.website/api/penghitunganTotal")
        .then((response) => {
          //assign state posts with response data
          laporans.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });

      axios
        .get("https://api.gofit.given.website/api/totalPendapatan")
        .then((response) => {
          //assign state posts with response data
          laporans2.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    function createChart() {
      if (!laporans.value.length) {
        return;
      }

      // Create chart
      const chartElement = document.getElementById("chart");
      const ctx = chartElement.getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: laporans.value.map((laporan) => laporan.bulan),
          datasets: [
            {
              label: "TOTAL TRANSAKSI",
              data: laporans.value.map((laporan) => laporan.total_transaksi),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    async function generatePdf() {
      const doc = new jsPDF();
      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "long" });
      const year = currentDate.getFullYear();
      const date = currentDate.getDate();

      const reportTitle = "LAPORAN PENDAPATAN BULANAN";
      const reportSubtitle = `BULAN: ${month}   TAHUN: ${year}`;
      const reportSubtitle2 = `TGL CETAK: ${date} ${month} ${year}`;

      const table = document.querySelector(".table");
      const tableImgData = await html2canvas(table, { useCORS: true }).then((canvas) => canvas.toDataURL("image/png"));

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
      doc.addImage(tableImgData, "PNG", 15, position, 185, 0);

      const chartElement = document.getElementById("chart");
      const chartImgData = await html2canvas(chartElement, { useCORS: true }).then((canvas) => canvas.toDataURL("image/png"));

      // Add chart to the next page
      doc.addPage();
      doc.addImage(chartImgData, "PNG", 15, 15, 185, 0);

      doc.save("laporan_pendapatan_tahunan.pdf");

      createChart();
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
      laporans2,
      laporan2,
      generatePdf,
      logout,
      selectedInstrukturId: null,
    };
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  margin: auto;
}

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
