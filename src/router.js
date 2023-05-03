//import vue router
import { createRouter, createWebHistory } from "vue-router";
//define a routes
const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/components/LoginPage.vue"),
  },

  {
    path: "/adminhome",
    name: "adminhome",
    component: () => import("@/views/Admin/AdminHome.vue"),
  },
  {
    path: "/createinstruktur",
    name: "addinstruktur",
    component: () => import("@/views/Admin/AddInstruktur.vue"),
  },
  {
    path: "/editinstruktur",
    name: "editinstruktur",
    component: () => import("@/views/Admin/EditInstruktur.vue"),
  },
  {
    path: "/kasirhome",
    name: "kasirhome",
    component: () => import("@/views/Kasir/KasirHome.vue"),
  },
  {
    path: "/addmember",
    name: "addmember",
    component: () => import("@/views/Kasir/AddMember.vue"),
  },
  {
    path: "/editmember",
    name: "editmember",
    component: () => import("@/views/Kasir/EditMember.vue"),
  },
  {
    path: "/mohome",
    name: "mohome",
    component: () => import("@/views/MO/MOHome.vue"),
  },
  {
    path: "/addJadwalUmum",
    name: "addJU",
    component: () => import("@/views/MO/AddJadwalUmum.vue"),
  },
  {
    path: "/editJadwalUmum",
    name: "editJU",
    component: () => import("@/views/MO/EditJadwalUmum.vue"),
  },
  //   {
  //     path: "/",
  //     name: "User",
  //     component: () => import("@/views/User/DashboardUser.vue"),
  //     children: [
  //       //Home
  //       {
  //         path: "/user",
  //         name: "userhome",
  //         component: () => import("@/views/User/UserHome.vue"),
  //       },
  //       {
  //         path: "/userprofile",
  //         name: "userprofile",
  //         component: () => import("@/views/User/Profile/ProfileIndex.vue"),
  //       },
  //       {
  //         path: "/userdist",
  //         name: "userdist",
  //         component: () => import("@/views/User/ListDistributor.vue"),
  //       },
  //       {
  //         path: "/userproduct",
  //         name: "userproduct",
  //         component: () => import("@/views/User/Produk/ListProduct.vue"),
  //       },
  //       {
  //         path: "/userpesan",
  //         name: "userpesan",
  //         component: () => import("@/views/User/Produk/PesanProduct.vue"),
  //       },
  //       {
  //         path: "/userpesanlist",
  //         name: "userpesanlist",
  //         component: () => import("@/views/User/Pemesanan/ListPemesanan.vue"),
  //       },
  //       {
  //         path: "/userpesanedit",
  //         name: "userpesanedit",
  //         component: () => import("@/views/User/Pemesanan/editPemesanan.vue"),
  //       },
  //       {
  //         path: "/userbeli",
  //         name: "userbeli",
  //         component: () => import("@/views/User/Pemesanan/BeliPage.vue"),
  //       },
  //     ],
  //   },
  //   {
  //     path: "/",
  //     name: "Admin",
  //     component: () => import("@/views/Admin/DashboardAdmin.vue"),
  //     children: [
  //       //Home
  //       {
  //         path: "/admin",
  //         name: "adminhome",
  //         component: () => import("@/views/Admin/AdminHome.vue"),
  //       },
  //       {
  //         path: "/admin/distributor",
  //         name: "admindistributor",
  //         component: () => import("@/views/Admin/Distributor/DistributorIndex.vue"),
  //       },
  //       {
  //         path: "/admin/distributor/create",
  //         name: "admindistributorcreate",
  //         component: () => import("@/views/Admin/Distributor/createPage.vue"),
  //       },
  //       {
  //         path: "/admin/distributor/edit",
  //         name: "admindistributoredit",
  //         component: () => import("@/views/Admin/Distributor/editPage.vue"),
  //       },
  //       {
  //         path: "/admin/product",
  //         name: "adminproduct",
  //         component: () => import("@/views/Admin/Product/ProductIndex.vue"),
  //       },
  //       {
  //         path: "/admin/product/create",
  //         name: "adminproductcreate",
  //         component: () => import("@/views/Admin/Product/createPage.vue"),
  //       },
  //       {
  //         path: "/admin/product/edit",
  //         name: "adminproductedit",
  //         component: () => import("@/views/Admin/Product/editPage.vue"),
  //       },
  //       {
  //         path: "/admin/listpemesanan",
  //         name: "adminlistpemesanan",
  //         component: () => import("@/views/Admin/ListPemesanan.vue"),
  //       },
  //     ],
  //   },
];
//create router
const router = createRouter({
  history: createWebHistory(),
  routes, // config routes
});
export default router;
