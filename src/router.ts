import { createRouter, createWebHistory} from "vue-router";
import Home from "./views/HomeView.vue";
import Test from "./views/TestAdmin.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
 	{ path: "/test", name: "Test", component: Test },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to) {
		if (to.hash) {
			return {
				el: to.hash,
				behavior: 'smooth'
			}
		}

		return { top: 0 }
	}
});

export default router;
