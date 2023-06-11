<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded shadow">
          <div class="card-body">
            <h4>EDIT JADWAL UMUM</h4>
            <hr />
            <form @submit.prevent="update">
              <div class="form-group mb-3">
                <label for="content" class="form-label">Hari</label>
                <select class="form-control" v-model="ju.hari">
                  <option value="" selected disabled>Pilih Hari</option>
                  <option value="Monday">Senin</option>
                  <option value="Tuesday">Selasa</option>
                  <option value="Wednesday">Rabu</option>
                  <option value="Thursday">Kamis</option>
                  <option value="Friday">Jumat</option>
                  <option value="Saturday">Sabtu</option>
                  <option value="Sunday">Minggu</option>
                </select>
                <!-- validation -->
                <div v-if="validation.hari" class="mt-2 alert alert-danger">
                  {{ validation.hari[0] }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="content" class="form-label">Jam Kelas</label>
                <select class="form-control" v-model="ju.jam_kelas">
                  <option value="" selected disabled>Pilih Jam Kelas</option>
                  <option value="07:00:00">07:00</option>
                  <option value="10:00:00">10:00</option>
                  <option value="13:00:00">13:00</option>
                  <option value="16:00:00">16:00</option>
                  <option value="19:00:00">19:00</option>
                  <option value="22:00:00">22:00</option>
                </select>
                <!-- validation -->
                <div v-if="validation.jam_kelas" class="mt-2 alert alert-danger">
                  {{ validation.jam_kelas[0] }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="content" class="form-label">Nama Instruktur</label>
                <select class="form-control" v-model="ju.id_instruktur">
                  <option value="" selected disabled>Pilih Instruktur</option>
                  <option v-for="instruktur in instrukturs" :key="instruktur.id" :value="instruktur.id">
                    {{ instruktur.nama_instruktur }}
                  </option>
                </select>
                <!-- validation -->
                <div v-if="validation.id_instruktur" class="mt-2 alert alert-danger">
                  {{ validation.id_instruktur[0] }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="content" class="form-label">Kelas</label>
                <select class="form-control" v-model="ju.id_kelas">
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
    //state ju

    let kelas = ref([]);
    let instrukturs = ref([]);

    const ju = reactive({
      id_instruktur: "",
      id_kelas: "",
      hari: "",
      jam_kelas: "",
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
      } else if (role !== "manager") {
        logout();
      }
      getJU();
      getKelas();
      getInstruktur();
    });

    function getJU() {
      axios
        .get("https://api.gofit.given.website/api/jadwalUmum/" + route.params.id)
        .then((response) => {
          //assign state posts with response data
          ju.id_kelas = response.data.data.id_kelas;
          ju.id_instruktur = response.data.data.id_instruktur;
          ju.hari = response.data.data.hari;
          ju.jam_kelas = response.data.data.jam_kelas;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }

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
    function getInstruktur() {
      axios
        .get("http://localhost:8000/api/instruktur")
        .then((response) => {
          //assign state posts with response data
          instrukturs.value = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
    //method update
    function update() {
      let id_instruktur = ju.id_instruktur;
      let id_kelas = ju.id_kelas;
      let hari = ju.hari;
      let jam_kelas = ju.jam_kelas;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .put("https://api.gofit.given.website/api/jadwalUmum/update/" + route.params.id, {
          id_instruktur: id_instruktur,
          id_kelas: id_kelas,
          hari: hari,
          jam_kelas: jam_kelas,
        })
        .then(() => {
          //redirect ke post index
          router
            .push({
              name: "mohome",
            })
            .then(() => {
              toaster.success(`Berhasil EDIT Jadwal Umum`);
            });
        })
        .catch((error) => {
          //assign state validation with error
          if (error.response.data.tabrakan) {
            toaster.warning(`Jadwal Instruktur Bertabrakan`);
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
      ju,
      validation,
      router,
      update,
      getInstruktur,
      getKelas,
      getJU,
      instrukturs,
      kelas,
    };
  },
};
</script>
<style></style>
