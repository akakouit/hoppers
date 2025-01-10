// Menu bar
document.addEventListener("DOMContentLoaded", function () {
  const drawerButton = document.querySelector(".zdo_drawer_button");
  const drawerMenu = document.querySelector(".zdo_drawer_menu");
  if (drawerButton && drawerMenu) {
    drawerButton.addEventListener("click", function () {
      drawerMenu.classList.toggle("open");
    });
  }
});

// Welcome Page (Fullscreen Icon)
window.addEventListener("load", function () {
  const intro = document.getElementById("intro");
  if (intro) {
    setTimeout(function () {
      intro.style.opacity = "0";
      document.body.classList.add("show-header");
      setTimeout(function () {
        intro.style.display = "none";
      }, 2000);
    }, 1000);
  }
});

// Fade-in image slideshow
(function () {
  const interval = 5000; // Interval between slides (ms)
  const fadeSpeed = 1000; // Fade speed (ms)
  const images = $(".fade-img-box img");
  if (images.length > 0) {
    images.hide();
    images.first().addClass("active").show();

    const changeImage = function () {
      const $active = $(".fade-img-box img.active");
      const $next = $active.next("img").length ? $active.next("img") : $(".fade-img-box img:first");

      $active.fadeOut(fadeSpeed).removeClass("active");
      $next.fadeIn(fadeSpeed).addClass("active");
    };

    setInterval(changeImage, interval);
  }
})();

// Fetch and display Instagram media
const id = "17841449006495616";
const accessToken = "EAAFtbkZCQyfIBO8ZB19BAXZCSqgnIw3nYbvHT20gbX0njhyjkYsPBw2rWVtkh9U8XFf0DO7X22VbinbloL0Ck2Pk5rDLltZAvmWDdiYyix2c2oOR3dMZCNYhQKSbSiTRDUyV83n6RcV0tZAeywzyU4RJxvp9myb3o3wxt3YSZBUfj4OTM9ZCn59wqoZCgBqQnFKZBDYoi2RZCeBjXQ8jTDg5wZDZD";
const target = "hopper_s_club";
const url = `https://graph.facebook.com/v21.0/${id}?fields=business_discovery.username(${target}){media{id,caption,thumbnail_url,media_url,permalink,media_type,timestamp}}&access_token=${accessToken}`;

const mediaContainer = document.getElementById("media-container");

if (mediaContainer) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const mediaData = data?.business_discovery?.media?.data;
      if (Array.isArray(mediaData) && mediaData.length > 0) {
        const sortedMedia = mediaData
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3); // Take the top 3 items

        sortedMedia.forEach((item) => {
          const mediaWrapper = document.createElement("a");
          mediaWrapper.href = item.permalink;
          mediaWrapper.target = "_blank";
          mediaWrapper.rel = "noopener noreferrer";

          const img = document.createElement("img");
          if (item.media_type === "VIDEO" && item.thumbnail_url) {
            img.src = item.thumbnail_url;
            img.alt = "Video thumbnail";
          } else if (["IMAGE", "CAROUSEL_ALBUM"].includes(item.media_type) && item.media_url) {
            img.src = item.media_url;
            img.alt = item.caption || "Instagram image";
          } else {
            console.error("Invalid media item:", item);
            return; // Skip invalid items
          }

          img.style.width = "100%";
          img.style.height = "auto";

          mediaWrapper.appendChild(img);
          mediaContainer.appendChild(mediaWrapper);
        });
      } else {
        console.error("No media found for the specified username.");
        mediaContainer.innerHTML = "<p>No media found for this user.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      mediaContainer.innerHTML = "<p>Failed to load media due to an error.</p>";
    });
}
