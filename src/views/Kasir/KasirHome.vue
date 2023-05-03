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
              <li><a class="dropdown-item" href="#">Member</a></li>
              <li><a class="dropdown-item" href="#">Transaksi</a></li>
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
              <div class="col-md-6" style="margin-left: 8%">
                <router-link :to="{ name: 'addmember' }" class="btn btn-md btn-success">TAMBAH MEMBER</router-link>
              </div>
              <div class="col-md-2 offset-md-2">
                <input type="text" class="form-control me-2" v-model="searchInput" />
                <ul>
                  <li v-for="item in displayedMembers" :key="item.id">{{ item.nama_member }}</li>
                </ul>
              </div>
            </div>

            <table class="table table-striped table-bordered mt-4 table-responsive">
              <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">NAMA MEMBER</th>
                  <th scope="col">EMAIL</th>

                  <th scope="col">JENIS KELAMIN</th>
                  <th scope="col">NOMOR TELEPON</th>
                  <th scope="col">TANGGAL LAHIR</th>
                  <th scope="col">TANGGAL KADALUARSA</th>

                  <th scope="col">STATUS</th>
                  <th scope="col">AKSI</th>
                  <th scope="col">CARD</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(user, id) in users" :key="id">
                  <td>{{ user.nama_member }}</td>
                  <td>{{ user.email }}</td>

                  <td>{{ user.jk_member }}</td>
                  <td>{{ user.telp_member }}</td>
                  <td>{{ user.tgl_lahir_member }}</td>
                  <td v-if="user.tgl_expired_member">{{ user.tgl_expired_member }}</td>
                  <td v-else>- - -</td>

                  <td v-if="user.status_member">Aktif</td>
                  <td v-else>Tidak Aktif</td>
                  <td class="text-center">
                    <router-link :to="{ name: 'editmember', params: { id: user.id } }" class="btn btn-sm btn-primary mr-1"> EDIT</router-link>&nbsp;
                    <button type="button" class="btn btn-sm btn-danger mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="getId(user.id)">DELETE</button>&nbsp;
                    <button type="button" class="btn btn-sm btn-success mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal2" @click="getId(user.id)">RESET PW</button>
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
        .get("http://127.0.0.1:8000/api/user")
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
        .delete(`http://127.0.0.1:8000/api/user/${id}`, {})
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
        .put(`http://127.0.0.1:8000/api/resetPW/${id}`, {})
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
      axios.get(`http://127.0.0.1:8000/api/user/${id}`, {}).then((response) => {
        user.id = response.data.data.id;
        user.nama_member = response.data.data.nama_member;
      });
    }
    function generatePdf(id) {
      // Retrieve data from the database
      axios
        .get(`http://127.0.0.1:8000/api/user/${id}`, {})
        .then((response) => {
          //assign state posts with response data
          this.member = response.data.data;

          // Create a new PDF document
          const doc = new jsPDF();

          // Add a table with the data to the PDF
          const columns = ["ID", "Nama", "Tanggal Kadaluarsa", "Tanggal Lahir"];
          const rows = [[this.member.id_member, this.member.nama_member, this.member.tgl_expired_member, this.member.tgl_lahir_member]];

          doc.autoTable(columns, rows);

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
