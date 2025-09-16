document.addEventListener("DOMContentLoaded", () => {
    const ele = document.getElementsByClassName("page");
    const resume = document.getElementById("resume");
    const img = document.getElementById("B-img");
    const connectbtn = document.getElementById("Connectbtn");
    const more_project = document.getElementById("more_project");
    const toggle = document.getElementById("toggle");
    const footer = document.getElementById("footer");
    let darkMode = false;
    toggle.addEventListener("click", () => {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
            img.style.boxShadow = "0px 0px 10px #fafafa";
            toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            footer.style.backgroundColor = "#fafafa";
            for (let i = 0; i < ele.length; i++) ele[i].style.color = "white";
            toggle.style.backgroundColor = "black"
            toggle.style.color = "white"
            resume.style.backgroundColor = "#ffbf00";
            resume.style.color = "#000";
            connectbtn.style.backgroundColor = "#ffbf00";
            connectbtn.style.color = "#000";
            more_project.style.backgroundColor = "#ffbf00";
            more_project.style.color = "#000";

        } else {
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
            img.style.boxShadow = "0px 0px 10px #000";
            toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            footer.style.backgroundColor = "#000000";
            for (let i = 0; i < ele.length; i++) ele[i].style.color = "black";
            toggle.style.backgroundColor = "white"
            toggle.style.color = "black"
            resume.style.backgroundColor = "#ffbf00";
            resume.style.color = "#000";
            connectbtn.style.backgroundColor = "#ffbf00";
            connectbtn.style.color = "#000";
            more_project.style.backgroundColor = "#ffbf00";
            more_project.style.color = "#000";
        }
    });
    // Hover effect
    function addHoverEffect(btn) {
        btn.addEventListener("mouseover", () => {
            btn.style.backgroundColor = darkMode ? "white" : "black";
            btn.style.color = darkMode ? "black" : "white";
        });
        btn.addEventListener("mouseout", () => {
            btn.style.backgroundColor = "#ffbf00";
            btn.style.color = "#000";
        });
    }

    addHoverEffect(resume);
    addHoverEffect(connectbtn);
    addHoverEffect(more_project);

    const email = document.getElementById("emailTAG");
    email.addEventListener("mouseover", () => {
        email.style.color = darkMode ? "black" : "white";
    });
    email.addEventListener("mouseout", () => {
        email.style.color = "#6e6b77";
    });


    // const social_link = document.getElementsByClassName("sl-a");
    // social_link.addEventListener("mouseover", () => {
    //     for (let i = 0; i < social_link.length; i++) {
    //         social_link[i].style.color = darkMode ? "black" : "white";
    //     }
    // });
    // social_link.addEventListener("mouseout", () => {
    //     for (let i = 0; i < social_link.length; i++) {
    //         social_link[i].style.color = "#6e6b77";
    //     }
    // });
    // const social_links = document.getElementsByClassName("sl-a");
    // for (let i = 0; i < social_links.length; i++) {
    //     social_links[i].addEventListener("mouseover", () => {
    //         social_links[i].style.color = darkMode ? "black" : "white";
    //     });
    //     social_links[i].addEventListener("mouseout", () => {
    //         social_links[i].style.color = "#6e6b77";
    //     });
    // }


    const footer_nav = document.getElementsByClassName("footer-nav");
    const footer_para = document.getElementsByClassName("footer-para");
    function addHoverEffectOnfooter(item) {

    }
    const skillOpen1 = document.getElementById("skills");
    const skillOpen2 = document.getElementById("skillInFooter");
    const skillSection = document.getElementById("skillsectionM");
    const skillClose = document.getElementById("back");


    skillOpen1.addEventListener("click", (e) => {
        e.preventDefault();
        skillSection.style.display = "block";
        // Animate bars from data-level attribute
        document.querySelectorAll('.skill-row').forEach((row, idx) => {
        const pct = row.getAttribute('data-level') || 50;
        const bar = row.querySelector('.bar');
        // stagger animation slightly
        setTimeout(() => {
            bar.style.width = pct + '%';
        }, 100 + idx * 80);
    });
    });

    skillOpen2.addEventListener("click", (e) => {
        e.preventDefault();
        skillSection.style.display = "block";
        // Animate bars from data-level attribute
        document.querySelectorAll('.skill-row').forEach((row, idx) => {
        const pct = row.getAttribute('data-level') || 50;
        const bar = row.querySelector('.bar');
        // stagger animation slightly
        setTimeout(() => {
            bar.style.width = pct + '%';
        }, 100 + idx * 80);
    });
    });

    skillClose.addEventListener("click", () => {
        skillSection.style.display = "none";
    });
});
