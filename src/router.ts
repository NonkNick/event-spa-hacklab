import { createRouter, createWebHistory} from "vue-router";
import Home from "./views/HomeView.vue";
import Test from "./views/TestAdmin.vue";
import Event from "./views/EventDemoView.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
 	{ path: "/test", name: "Test", component: Test },
	{ path: "/test1", name: "Event", component: Event }
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
