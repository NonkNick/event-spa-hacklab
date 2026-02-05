import { createRouter, createWebHistory} from "vue-router";

import Home from "./views/HomeView.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
     { path: '/test', component: () => import('./views/TestAdmin.vue') }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
