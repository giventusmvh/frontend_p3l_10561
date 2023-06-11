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
    <h1 class="h2">Member List</h1>
  </div>
  <div class="mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <router-link :to="{ name: 'addmember' }" class="btn btn-md btn-success shadow">TAMBAH MEMBER</router-link>
              </div>
            </div>
            <div class="form-group mt-4">
              <input type="text" class="form-control" placeholder="Cari" v-model="searchKeyword" />
            </div>
            <table class="table table-striped table-bordered mt-4 table-responsive shadow">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">NAMA MEMBER</th>
                  <th scope="col">EMAIL</th>

                  <th scope="col">NOMOR TELEPON</th>

                  <th scope="col">TANGGAL KADALUARSA</th>

                  <th scope="col">STATUS</th>
                  <th scope="col">AKSI</th>
                  <th scope="col">TRANSAKSI</th>
                  <th scope="col">CARD</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(user, id) in filteredUsers" :key="id">
                  <td>{{ user.nama_member }}</td>
                  <td>{{ user.email }}</td>

                  <td>{{ user.telp_member }}</td>

                  <td v-if="user.tgl_expired_member">{{ user.tgl_expired_member }}</td>
                  <td v-else>- - -</td>

                  <td v-if="user.status_member">Aktif</td>
                  <td v-else>Tidak Aktif</td>
                  <td class="text-center">
                    <router-link :to="{ name: 'editmember', params: { id: user.id } }" class="btn btn-sm btn-primary mr-1"><i class="bi bi-pencil-square"></i></router-link>&nbsp;
                    <button type="button" class="btn btn-sm btn-danger mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="getId(user.id)"><i class="bi bi-trash"></i></button>&nbsp;
                    <button type="button" class="btn btn-sm btn-success mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal2" @click="getId(user.id)">RESET PW</button>&nbsp;
                  </td>
                  <td class="text-center">
                    <span v-if="user.status_member === '1'"><button class="btn btn-secondary btn-sm" disabled>AKTIVASI</button></span>&nbsp;
                    <span v-else
                      ><router-link :to="{ name: 'addaktivasi', params: { id: user.id } }"><button class="btn btn-outline-success btn-sm">AKTIVASI</button></router-link></span
                    >&nbsp; <router-link :to="{ name: 'adddeporeguler', params: { id: user.id } }"><button class="btn btn-outline-success btn-sm">REGULER</button></router-link>&nbsp;
                    <router-link :to="{ name: 'adddepokelas', params: { id: user.id } }"><button class="btn btn-outline-primary btn-sm">KELAS</button></router-link>&nbsp;
                  </td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-success m-1" @click="generatePdf(user.id)"><i class="bi bi-filetype-pdf"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Delete-->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Konfirmasi</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Yakin ingin menghapus data member {{ user.nama_member }} ?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">BATAL</button>
          <button type="button" class="btn btn-danger" @click="del(user.id)">HAPUS</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Reset PW-->
  <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Konfirmasi</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Yakin ingin reset password member {{ user.nama_member }} ?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">BATAL</button>
          <button type="button" class="btn btn-danger" @click="resetPW(user.id)">RESET</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal DEPOSIT-->
  <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Konfirmasi</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">PILIH DEPOSIT</div>
        <div class="modal-footer">
          <router-link :to="{ name: 'adddeporeguler', params: { id: user.id } }"><button class="btn btn-outline-success btn-sm">UANG REGULER</button></router-link>
          <button type="button" class="btn btn-danger">KELAS</button>
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
import { onMounted, ref, computed } from "vue";
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
    const searchKeyword = ref("");
    let users = ref([]);
    const user = reactive({
      id: "",
      id_member: "",
      nama_member: "",
      alamat_member: "",
      tgl_lahir_member: "",
      telp_member: "",
      jk_member: "",
      deposit_uang_member: "",
      status_member: "",
      email: "",
      password: "",
    });
    const filteredUsers = computed(() => {
      const keyword = searchKeyword.value.toLowerCase().trim();
      if (!keyword) {
        return users.value;
      } else {
        return users.value.filter((user) => {
          // Sesuaikan properti yang ingin dijadikan kriteria pencarian
          return user.nama_member.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword) || user.telp_member.toLowerCase().includes(keyword);
        });
      }
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
      } else if (role !== "kasir") {
        logout();
      }
      //get API from Laravel Backend
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("https://api.gofit.given.website/api/user")
        .then((response) => {
          //assign state posts with response data
          users.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
    function del(id) {
      axios
        .delete(`https://api.gofit.given.website/api/user/${id}`, {})
        .then(() => {
          //redirect ke halaman login
          window.location.reload();
          // .then(() => {
          //toaster.warning(`Berhasil Delete Data Produk`)
          // });
        })
        .catch((error) => {
          //assign state validation with error
          validation.value = error.response.data;
        });
    }
    function resetPW(id) {
      axios
        .put(`https://api.gofit.given.website/api/resetPW/${id}`, {})
        .then(() => {
          //redirect ke halaman login
          window.location.reload();
          // .then(() => {
          //   toaster.warning(`Berhasil Delete Data Produk`);
          // });
        })
        .catch((error) => {
          //assign state validation with error
          validation.value = error.response.data;
        });
    }
    function getId(id) {
      axios.get(`https://api.gofit.given.website/api/user/${id}`, {}).then((response) => {
        user.id = response.data.data.id;
        user.nama_member = response.data.data.nama_member;
      });
    }
    function generatePdf(id) {
      // Retrieve data from the database
      axios
        .get(`https://api.gofit.given.website/api/user/${id}`, {})
        .then((response) => {
          //assign state posts with response data
          this.member = response.data.data;

          // Create a new PDF document
          var doc = new jsPDF();

          // Define the position and size of the card
          var cardX = 10;
          var cardY = 10;
          var cardWidth = 150;
          var cardHeight = 50;

          // Draw the card border
          doc.rect(cardX, cardY, cardWidth, cardHeight);

          // Write the member data inside the card
          doc.text("ID Member: " + this.member.id_member, cardX + 5, cardY + 10);
          doc.text("Nama Member: " + this.member.nama_member, cardX + 5, cardY + 20);
          doc.text("Alamat Member: " + this.member.alamat_member, cardX + 5, cardY + 30);
          doc.text("Tanggal Lahir Member: " + this.member.tgl_lahir_member, cardX + 5, cardY + 40);

          // Download the PDF
          doc.save("members.pdf");
        })
        .catch((error) => {
          console.log(error.response.data);
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
      users,
      del,
      resetPW,
      logout,
      generatePdf,
      user,
      getId,
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
