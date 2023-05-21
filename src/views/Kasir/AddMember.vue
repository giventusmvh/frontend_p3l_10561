<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>TAMBAH MEMBER</h4>
            <hr />
            <form @submit.prevent="store">
              <div class="form-group mb-3">
                <label class="form-label">Nama Member</label>
                <input type="text" class="form-control" v-model="user.nama_member" placeholder="Masukkan nama member" />
                <!-- validation -->
                <div v-if="validation.nama_member" class="mt-2 alert alert-danger">
                  {{ validation.nama_member[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Email Member</label>
                <input type="email" class="form-control" v-model="user.email" placeholder="Masukkan Email member" />
                <!-- validation -->
                <div v-if="validation.email" class="mt-2 alert alert-danger">
                  {{ validation.email[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Tanggal Lahir Member</label>
                <input type="date" class="form-control" v-model="user.tgl_lahir_member" placeholder="Masukkan Tanngal Lahir member" />
                <!-- validation -->
                <div v-if="validation.tgl_lahir_member" class="mt-2 alert alert-danger">
                  {{ validation.tgl_lahir_member[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Jenis Kelamin</label>
                <select class="form-control" v-model="user.jk_member">
                  <option value="" selected disabled>Pilih Jenis Kelamin</option>
                  <option value="Pria">Pria</option>
                  <option value="Wanita">Wanita</option>
                </select>
                <!-- validation -->
                <div v-if="validation.jk_member" class="mt-2 alert alert-danger">
                  {{ validation.jk_member[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Telepon Member</label>
                <input type="number" class="form-control" v-model="user.telp_member" placeholder="Masukkan No Telp member" />
                <!-- validation -->
                <div v-if="validation.telp_member" class="mt-2 alert alert-danger">
                  {{ validation.telp_member[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Alamat Member</label>
                <input class="form-control" v-model="user.alamat_member" placeholder="Masukkan Alamat" />
                <!-- validation -->
                <div v-if="validation.alamat_member" class="mt-2 alert alert-danger">
                  {{ validation.alamat_member[0] }}
                </div>
              </div>

              <!-- <div class="form-group mb-3">
                <label for="content" class="form-label">Deposit Uang</label>
                <input class="form-control" v-model="user.deposit_uang_member" placeholder="Masukkan Deposit Uang" disabled />
                
                <div v-if="validation.deposit_uang_member" class="mt-2 alert alert-danger">
                  {{ validation.deposit_uang_member[0] }}
                </div>
              </div> -->
              <!-- <div class="form-group mb-3">
                <label for="content" class="form-label">Status Member</label>
                <input class="form-control" type="text" v-model="user.status_member" placeholder="Masukkan Status" />
                 validation 
                <div v-if="validation.status_member" class="mt-2 alert alert-danger">
                  {{ validation.status_member[0] }}
                </div>
              </div> -->
              <button type="submit" class="btn btn-primary">SIMPAN</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";
export default {
  setup() {
    const toaster = createToaster({
      position: "top-right",
      duration: 2000,
    });
    //state user
    const user = reactive({
      nama_member: "",
      alamat_member: "",
      tgl_lahir_member: "",
      telp_member: "",
      jk_member: "",
      // deposit_uang_member: "0",
      // status_member: "",
      email: "",
    });
    //state validation
    const validation = ref([]);
    //vue router
    const router = useRouter();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    onMounted(() => {
      if (!token) {
        router.push({
          name: "Login",
        });
      } else if (role !== "kasir") {
        logout();
      }
    });
    //method store
    function store() {
      let nama_member = user.nama_member;
      let alamat_member = user.alamat_member;
      let tgl_lahir_member = user.tgl_lahir_member;
      let telp_member = user.telp_member;
      let email = user.email;
      let jk_member = user.jk_member;
      // let status_member = user.status_member;
      // let deposit_uang_member = user.deposit_uang_member;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post("http://127.0.0.1:8000/api/user", {
          nama_member: nama_member,
          alamat_member: alamat_member,
          tgl_lahir_member: tgl_lahir_member,
          telp_member: telp_member,
          email: email,
          jk_member: jk_member,
          // status_member: status_member,
          // deposit_uang_member: deposit_uang_member,
        })
        .then(() => {
          //redirect ke post index
          router
            .push({
              name: "kasirhome",
            })
            .then(() => {
              toaster.success(`Berhasil Menambah Member`);
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
      user,
      validation,
      router,
      store,
    };
  },
};
</script>
<style></style>
