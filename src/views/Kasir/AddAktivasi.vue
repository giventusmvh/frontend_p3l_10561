<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>AKTIVASI MEMBER</h4>
            <hr />
            <form @submit.prevent="update">
              <div class="form-group mb-3">
                <label class="form-label">ID Member</label>
                <input type="text" class="form-control" v-model="user.id_member" readonly disabled />
                <!-- validation -->
                <div v-if="validation.id_member" class="mt-2 alert alert-danger">
                  {{ validation.id_member[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">Nama Member</label>
                <input type="text" class="form-control" v-model="user.nama_member" placeholder="Masukkan nama member" disabled />
                <!-- validation -->
                <div v-if="validation.nama_member" class="mt-2 alert alert-danger">
                  {{ validation.nama_member[0] }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label class="form-label">Jumlah Bayar Aktivasi</label>
                <input type="text" class="form-control" v-model="aktivasi.jumlah_bayar_aktivasi" placeholder="Masukkan jumlah bayar" />
                <!-- validation -->
                <div v-if="validation.jumlah_bayar_aktivasi" class="mt-2 alert alert-danger">
                  {{ validation.jumlah_bayar_aktivasi[0] }}
                </div>
              </div>

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
import { useRouter, useRoute } from "vue-router";
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
      id: "",
      id_member: "",
      nama_member: "",
      alamat_member: "",
      tgl_lahir_member: "",
      telp_member: "",
      jk_member: "",
      // deposit_uang_member: "",
      // status_member: "",
      email: "",
      password: "",
    });

    const aktivasi = reactive({
      jumlah_bayar_aktivasi: "",
    });
    //state validation
    const validation = ref([]);
    //vue router
    const router = useRouter();
    //params id
    const route = useRoute();
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

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("http://127.0.0.1:8000/api/user/" + route.params.id)
        .then((response) => {
          //assign state posts with response data
          user.id = response.data.data.id;
          user.id_member = response.data.data.id_member;
          user.nama_member = response.data.data.nama_member;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
    //method update
    function update() {
      let id_pegawai_aktivasi = localStorage.getItem("id");
      let id_member_aktivasi = user.id;
      let jumlah_bayar_aktivasi = aktivasi.jumlah_bayar_aktivasi;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post("http://127.0.0.1:8000/api/aktivasi", {
          id_pegawai_aktivasi: id_pegawai_aktivasi,
          id_member_aktivasi: id_member_aktivasi,
          jumlah_bayar_aktivasi: jumlah_bayar_aktivasi,
        })
        .then(() => {
          //redirect ke post index
          router
            .push({
              name: "kasirhome",
            })
            .then(() => {
              toaster.success(`Berhasil Aktivasi Data Member`);
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
      aktivasi,
      validation,
      router,
      update,
    };
  },
};
</script>
<style></style>
