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
    <h1 class="h2">List Transaksi Aktivasi</h1>
  </div>
  <div class="mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6" style="margin-left: 8%"></div>
            </div>

            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">NO STRUK</th>
                  <th scope="col">NAMA MEMBER</th>
                  <th scope="col">TANGGAL TRANSAKSI AKTIVASI</th>
                  <th scope="col">MASA BERLAKU</th>
                  <th scope="col">CETAK STRUK</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(aktivasi, id) in aktivasis" :key="id">
                  <td>{{ aktivasi.no_struk }}</td>
                  <td>{{ aktivasi.nama_member }}</td>
                  <td>{{ aktivasi.tgl_TransaksiAktivasi }}</td>
                  <td>{{ aktivasi.masa_berlaku_aktivasi }}</td>

                  <td class="text-center">
                    <button class="btn btn-sm btn-success m-1" @click="generatePdf(aktivasi.id, aktivasi.id_member_aktivasi)"><i class="bi bi-filetype-pdf"></i></button>
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

    let aktivasis = ref([]);
    let members = ref([]);
    const aktivasi = reactive({
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
        .get("http://127.0.0.1:8000/api/aktivasi")
        .then((response) => {
          //assign state posts with response data
          aktivasis.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });

      //get API from Laravel Backend
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("http://127.0.0.1:8000/api/user")
        .then((response) => {
          //assign state posts with response data
          members.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    function getId(id) {
      axios.get(`http://127.0.0.1:8000/api/aktivasi/${id}`, {}).then((response) => {
        aktivasi.id = response.data.data.id;
      });
    }
    function generatePdf(id1, id2) {
      const id3 = localStorage.getItem("id");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .all([axios.get(`http://127.0.0.1:8000/api/aktivasi/${id1}`, {}), axios.get(`http://127.0.0.1:8000/api/user/${id2}`, {}), axios.get(`http://127.0.0.1:8000/api/pegawai/${id3}`, {})])
        .then(
          axios.spread((res1, res2, res3) => {
            this.aktivasi = res1.data.data;
            this.member = res2.data.data;
            this.pegawai = res3.data.data;

            // Create a new PDF document
            var doc = new jsPDF();

            // Define the position and size of the card
            var cardX = 10;
            var cardY = 10;
            var cardWidth = 150;
            var cardHeight = 70;

            // Draw the card border
            doc.rect(cardX, cardY, cardWidth, cardHeight);

            // Write the member data inside the card
            doc.text("-----STRUK AKTIVASI TAHUNAN-----", cardX + 35, cardY + 5);
            doc.text("No Struk: " + this.aktivasi.no_struk, cardX + 5, cardY + 15);
            doc.text("Nama Member / ID Member: " + this.member.nama_member + "/" + this.member.id_member, cardX + 5, cardY + 25);
            doc.text("Tanggal: " + this.aktivasi.tgl_TransaksiAktivasi, cardX + 5, cardY + 35);
            doc.text("Aktivasi Tahunan: 3000000", cardX + 5, cardY + 45);
            doc.text("Masa Aktif Member: " + this.aktivasi.masa_berlaku_aktivasi, cardX + 5, cardY + 55);
            doc.text("Kasir: " + this.pegawai.nama_pegawai + "/" + this.pegawai.id_pegawai, cardX + 5, cardY + 65);

            // Download the PDF
            doc.save("strukAktivasiMember.pdf");
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
      aktivasis,
      members,
      logout,
      generatePdf,
      aktivasi,
      getId,
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
