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
    <h1 class="h2">LIST SEMUA PERIZINAN</h1>
  </div>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <!-- <router-link :to="{ name: 'addizin' }" class="btn btn-md btn-success shadow">TAMBAH INSTRUKTUR</router-link> -->
            <router-link :to="{ name: 'perizinanbelum' }" class="btn btn-md btn-success shadow">TAMPIL BELUM KONFIRMASI</router-link>

            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">NAMA INSTRUKTUR</th>
                  <th scope="col">NAMA INSTRUKTUR PENGGANTI</th>
                  <th scope="col">KELAS</th>
                  <th scope="col">TANGGAL MENGAJUKAN</th>
                  <th scope="col">TANGGAL YANG DIAJUKAN</th>
                  <th scope="col">KETERANGAN</th>
                  <th scope="col">AKSI</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(izin, id) in izins" :key="id">
                  <td>{{ izin.nama_instrukturIzin }}</td>
                  <td>{{ izin.nama_instrukturPengganti }}</td>
                  <td>{{ izin.nama_kelas }}</td>
                  <td>{{ izin.tgl_izin_dibuat }}</td>
                  <td>{{ izin.tgl_izin }}</td>
                  <td>{{ izin.keterangan }}</td>
                  <td v-if="izin.konfirmasi === 0"><button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="getId(izin.id)">KONFIRMASI</button></td>
                  <td v-else><button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled>KONFIRMASI</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Button trigger modal -->

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Konfirmasi</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Yakin konfirmasi data izin {{ izin.id }}?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">BATAL</button>
          <button type="button" class="btn btn-danger" @click="konfirmasi(izin.id)">KONFIRMASI</button>
        </div>
      </div>
    </div>
  </div>
</template>
//
<script>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { createToaster } from "@meforma/vue-toaster";
export default {
  setup() {
    const toaster = createToaster({
      position: "top-right",
      duration: 2000,
    });
    //reactive state
    let izins = ref([]);
    const izin = reactive({
      id: "",
      nama_izin: "",
    });
    //state validation
    const validation = ref([]);
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
        .get("http://127.0.0.1:8000/api/izinInstruktur/")
        .then((response) => {
          //assign state posts with response data
          izins.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
    function getId(id) {
      axios.get(`http://127.0.0.1:8000/api/izinInstruktur/showByID/${id}`, {}).then((response) => {
        izin.id = response.data.data.id;
      });
    }

    function konfirmasi(id) {
      axios
        .put(`http://127.0.0.1:8000/api/izinInstruktur/konfirmasi/${id}`, {})
        .then(() => {
          //redirect ke halaman login
          window.location.reload().then(() => {
            toaster.warning(`Berhasil Konfirmasi Perizinan`);
          });
        })
        .catch((error) => {
          //assign state validation with error
          validation.value = error.response.data;
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
      izins,
      izin,
      getId,
      konfirmasi,
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
