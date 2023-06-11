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
  <div class="container d-flex jhstify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Jadwal Harian</h1>
  </div>
  <div class="mt-5 container">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <div class="container">
              <button @click="generateJadwalHarian()" class="btn btn-md btn-success shadow">Generate Jadwal Harian</button>
            </div>
            <div class="form-group mt-4">
              <input type="text" class="form-control" placeholder="Cari" v-model="searchKeyword" />
            </div>
            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">HARI</th>
                  <th scope="col">TANGGAL</th>
                  <th scope="col">JAM KELAS</th>
                  <th scope="col">NAMA INSTRUKTUR</th>
                  <th scope="col">KELAS</th>
                  <th scope="col">PENGGANTI</th>
                  <th scope="col">STATUS</th>
                  <th scope="col">AKSI</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(jh, id) in filteredUsers" :key="id">
                  <td>{{ jh.hari }}</td>
                  <td>{{ jh.tanggal }}</td>
                  <td>{{ jh.jam_kelas }}</td>

                  <td>{{ jh.nama_instruktur }}</td>
                  <td>{{ jh.nama_kelas }}</td>
                  <td v-if="jh.status_jadwalHarian === NULL">NaN</td>
                  <td v-else>{{ jh.nama_instruktur_pengganti }}</td>
                  <td v-if="jh.status_jadwalHarian === '1'">Masuk</td>
                  <td v-else>Libur</td>

                  <td v-if="jh.konfirmasi === '1'"><button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="getId(jh.id)">UPDATE</button></td>
                  <td v-else><button type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled>UPDATE</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Konfirmasi</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Yakin ingin update Libur / Ganti Instruktur ?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="gantiInstruktur(jh.id)">GANTI INSTRUKTUR</button>
          <button type="button" class="btn btn-danger" @click="libur(jh.id)">LIBURKAN</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">BATAL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

import { createToaster } from "@meforma/vue-toaster";
export default {
  setup() {
    const toaster = createToaster({
      position: "top-right",
      duration: 2000,
    });
    //reactive state
    const searchKeyword = ref("");
    let jhs = ref([]);
    const jh = reactive({
      id: "",
    });
    //state validation
    // const validation = ref([]);
    const router = useRouter();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const filteredUsers = computed(() => {
      const keyword = searchKeyword.value.toLowerCase().trim();
      if (!keyword) {
        return jhs.value;
      } else {
        return jhs.value.filter((jh) => {
          // Sesuaikan properti yang ingin dijadikan kriteria pencarian
          return jh.hari.toLowerCase().includes(keyword) || jh.tanggal.toLowerCase().includes(keyword) || jh.nama_kelas.toLowerCase().includes(keyword) || jh.nama_instruktur.toLowerCase().includes(keyword);
        });
      }
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
      //get API from Laravel Backend
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("https://api.gofit.given.website/api/jadwalHarian/index")
        .then((response) => {
          //assign state posts with response data
          jhs.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
    function getId(id) {
      axios.get(`https://api.gofit.given.website/api/jadwalHarian/${id}`, {}).then((response) => {
        jh.id = response.data.data.id;
      });
    }
    function libur(id) {
      axios.put(`https://api.gofit.given.website/api/jadwalHarian/libur/${id}`, {}).then(() => {
        //redirect ke halaman login

        window.location.reload().then(() => {
          toaster.warning(`Berhasil Meliburkan Jadwal`);
        });
      });
    }

    function gantiInstruktur(id) {
      axios.put(`https://api.gofit.given.website/api/jadwalHarian/gantiInstruktur/${id}`, {}).then(() => {
        //redirect ke halaman login

        window.location.reload().then(() => {
          toaster.warning(`Berhasil Mengganti Instruktur`);
        });
      });
    }
    function generateJadwalHarian() {
      axios
        .get("https://api.gofit.given.website/api/jadwalHarian/generate")
        .then(() => {
          //redirect ke halaman login

          window.location.reload().then(() => {
            toaster.warning(`Berhasil Generate Jadwal Harian`);
          });
        })

        .catch((error) => {
          //assign state validation with error
          if (error.response.data.cekGenerate) {
            toaster.warning(`Anda Sudah Generate Jadwal Harian Minggu ini`);
          }
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
      jhs,
      generateJadwalHarian,
      logout,
      gantiInstruktur,
      jh,
      getId,
      libur,
      searchKeyword,
      filteredUsers,
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
