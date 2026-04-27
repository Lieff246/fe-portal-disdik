// src/utils/notificationUtils.tsx
import Toastify from "toastify-js";

const showNotification = (status: string, title: string, message: string) => {
  const contentId =
    status === "success"
      ? "#success-notification-content"
      : "#failed-notification-content";

  const notificationTemplate = document.querySelectorAll(
    contentId
  )[0] as HTMLElement | null;
  if (notificationTemplate) {
    const successEl = notificationTemplate.cloneNode(true) as HTMLElement;
    successEl.classList.remove("hidden");

    const titleEl = successEl.querySelector(contentId + "-notification-title");
    const messageEl = successEl.querySelector(contentId + "-notification-text");

    if (titleEl && messageEl) {
      titleEl.innerHTML = title;
      messageEl.innerHTML = message;

      Toastify({
        node: successEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    } else {
      console.error(
        "Title or message element not found in the notification template."
      );
    }
  } else {
    console.error("Notification template not found.");
  }
};

export { showNotification };
