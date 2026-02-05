import { createRouter, createWebHistory } from 'vue-router'
import EventDemoView from '../views/EventDemoView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'event-demo',
            component: EventDemoView
        },
        {
            path: '/test',
            component: () => import('../views/TestAdmin.vue')
        }
    ]
})

export default router