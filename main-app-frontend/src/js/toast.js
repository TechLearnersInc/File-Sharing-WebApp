const toast = document.querySelector(".toast");

let toastTimer;
const time = 3000;

// The toast function
export const showToast = (msg) => {
    console.log("Ok");
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, time);
};
