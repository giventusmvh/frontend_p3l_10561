<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>UBAH INSTRUKTUR</h4>
            <hr />
            <form @submit.prevent="update">
              <div class="form-group mb-3">
                <label class="form-label">Nama Instruktur</label>
                <input type="text" class="form-control" v-model="instruktur.nama_instruktur" placeholder="Masukkan nama instruktur" />
                <!-- validation -->
                <div v-if="validation.nama_instruktur" class="mt-2 alert alert-danger">
                  {{ validation.nama_instruktur[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Alamat Instruktur</label>
                <input class="form-control" v-model="instruktur.alamat_instruktur" placeholder="Masukkan Alamat" />
                <!-- validation -->
                <div v-if="validation.alamat_instruktur" class="mt-2 alert alert-danger">
                  {{ validation.alamat_instruktur[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Tanggal Lahir</label>
                <input class="form-control" type="date" v-model="instruktur.tgl_lahir_instruktur" placeholder="2000-12-21" />
                <!-- validation -->
                <div v-if="validation.tgl_lahir_instruktur" class="mt-2 alert alert-danger">
                  {{ validation.tgl_lahir_instruktur[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Nomor Telepon</label>
                <input class="form-control" v-model="instruktur.telp_instruktur" placeholder="Masukkan Telepon" />
                <!-- validation -->
                <div v-if="validation.telp_instruktur" class="mt-2 alert alert-danger">
                  {{ validation.telp_instruktur[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Email</label>
                <input class="form-control" v-model="instruktur.email" placeholder="Masukkan Email" />
                <!-- validation -->
                <div v-if="validation.email" class="mt-2 alert alert-danger">
                  {{ validation.email[0] }}
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="content" class="form-label">Password</label>
                <input class="form-control" type="password" v-model="instruktur.password" placeholder="Masukkan Password" />
                <!-- validation -->
                <div v-if="validation.password" class="mt-2 alert alert-danger">
                  {{ validation.password[0] }}
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
    //state instruktur
    const instruktur = reactive({
      nama_instruktur: "",
      alamat_instruktur: "",
      tgl_lahir_instruktur: "",
      telp_instruktur: "",
      email: "",
      password: "",
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
      } else if (role !== "admin") {
        logout();
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("https://api.gofit.given.website/api/instruktur/" + route.params.id)
        .then((response) => {
          //assign state posts with response data
          instruktur.nama_instruktur = response.data.data.nama_instruktur;
          instruktur.alamat_instruktur = response.data.data.alamat_instruktur;
          instruktur.tgl_lahir_instruktur = response.data.data.tgl_lahir_instruktur;
          instruktur.telp_instruktur = response.data.data.telp_instruktur;
          instruktur.email = response.data.data.email;
          instruktur.password = response.data.data.password;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
    //method update
    function update() {
      let nama_instruktur = instruktur.nama_instruktur;
      let alamat_instruktur = instruktur.alamat_instruktur;
      let tgl_lahir_instruktur = instruktur.tgl_lahir_instruktur;
      let telp_instruktur = instruktur.telp_instruktur;
      let email = instruktur.email;
      let password = instruktur.password;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .put("https://api.gofit.given.website/api/instruktur/" + route.params.id, {
          nama_instruktur: nama_instruktur,
          alamat_instruktur: alamat_instruktur,
          tgl_lahir_instruktur: tgl_lahir_instruktur,
          telp_instruktur: telp_instruktur,
          email: email,
          password: password,
        })
        .then(() => {
          //redirect ke post index
          router
            .push({
              name: "adminhome",
            })
            .then(() => {
              toaster.success(`Berhasil Mengubah Data Instruktur`);
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
      instruktur,
      validation,
      router,
      update,
    };
  },
};
</script>
<style></style>
