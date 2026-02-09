import {ref} from "vue";

const isOpen =  ref(false)

export function useSidebar() {
    function openSidebar() {
        isOpen.value = true
    }

    function closeSidebar() {
        isOpen.value = false
    }

    function toggleSidebar() {
        isOpen.value = !isOpen.value
    }

    return {
        isOpen,
        openSidebar,
        closeSidebar,
        toggleSidebar
    }
}