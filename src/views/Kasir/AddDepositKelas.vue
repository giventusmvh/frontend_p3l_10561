<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>DEPOSIT KELAS MEMBER</h4>
            <hr />
            <form @submit.prevent="update">
              <div class="form-group mb-3">
                <label class="form-label">ID Member</label>
                <input type="text" class="form-control" v-model="user.id_member" disabled />
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
                <label for="content" class="form-label">Kelas</label>
                <select class="form-control" v-model="transaksiKelas.id_kelas">
                  <option value="" selected disabled>Pilih Kelas</option>
                  <option v-for="kls in kelas" :key="kls.id" :value="kls.id">
                    {{ kls.nama_kelas }}
                  </option>
                </select>
                <!-- validation -->
                <div v-if="validation.id_kelas" class="mt-2 alert alert-danger">
                  {{ validation.id_kelas[0] }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="content" class="form-label">Promo</label>
                <select class="form-control" v-model="transaksiKelas.id_promo_kelas">
                  <option value="" selected disabled>Pilih Promo</option>
                  <option value="2">Kelas 1 - Berlaku untuk jenis workout yang sama. Bayar 5 sesi, gratis 1. Berlaku 1 bulan sejak pembayaran.</option>
                  <option value="3">Kelas 2 - Bayar 10, gratis 3. Berlaku 2 bulan sejak pembayaran.</option>
                  <option value="4">Tanpa Promo</option>
                </select>
                <!-- validation -->
                <div v-if="validation.jam_kelas" class="mt-2 alert alert-danger">
                  {{ validation.jam_kelas[0] }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label class="form-label">Jumlah Deposit Kelas</label>
                <input type="text" class="form-control" v-model="transaksiKelas.jumlah_bayar_kelas" placeholder="Masukkan jumlah kelas" />
                <!-- validation -->
                <div v-if="validation.jumlah_bayar_kelas" class="mt-2 alert alert-danger">
                  {{ validation.jumlah_bayar_kelas[0] }}
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
      // deposit_kelas_member: "",
      // status_member: "",
      email: "",
      password: "",
    });
    let kelas = ref([]);
    const transaksiKelas = reactive({
      jumlah_bayar_kelas: "",
      id_kelas: "",
      id_promo_kelas: "",
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
      getKelas();

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

    function getKelas() {
      axios
        .get("http://localhost:8000/api/kelas")
        .then((response) => {
          //assign state posts with response data
          kelas.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }

    //method update
    function update() {
      let id_pegawai_kelas = localStorage.getItem("id");
      let id_member_kelas = user.id;
      let id_kelas = transaksiKelas.id_kelas;
      let jumlah_bayar_kelas = transaksiKelas.jumlah_bayar_kelas;
      let id_promo_kelas = transaksiKelas.id_promo_kelas;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .post("http://127.0.0.1:8000/api/transaksiKelas", {
          id_pegawai_kelas: id_pegawai_kelas,
          id_member_kelas: id_member_kelas,
          id_promo_kelas: id_promo_kelas,
          id_kelas: id_kelas,
          jumlah_bayar_kelas: jumlah_bayar_kelas,
        })
        .then(() => {
          //redirect ke post index
          router
            .push({
              name: "kasirhome",
            })
            .then(() => {
              toaster.success(`Berhasil Menambah Deposit Kelas`);
            });
        })
        .catch((error) => {
          if (error.response.data.promoerror) {
            toaster.warning(`Tidak Sesuai Promo, CEK LAGI`);
          } else if (error.response.data.belumhabis) {
            toaster.warning(`Deposit Kelas Belum Habis`);
          } else {
            validation.value = error.response.data;
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
      user,
      getKelas,
      kelas,
      transaksiKelas,
      validation,
      router,
      update,
    };
  },
};
</script>
<style></style>
