document.addEventListener('DOMContentLoaded', () => {
  // List of form fields to persist in localStorage
  const fields = ['Name','email', 'DOB', 'phone', 'Address','Hobbies', 'language','linkedin','education_10', 'education_12', 'education_Degree','skills','experience','projects','certifications'];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    const v = localStorage.getItem(id);
    if (v) el.value = v;

    el.addEventListener('input', e => {
      localStorage.setItem(id, e.target.value);
    });
  });

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  // Load Profile Picture
  const profilePicPreview = document.getElementById('profilePicPreview');
  const savedPic = localStorage.getItem('profilePic');
  if (savedPic && profilePicPreview) {
    profilePicPreview.src = savedPic;
    profilePicPreview.style.display = 'block';
  }

  const profilePicInput = document.getElementById('profilePicInput');
  if (profilePicInput && profilePicPreview) {
    profilePicInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const dataURL = event.target.result;
          localStorage.setItem('profilePic', dataURL);
          profilePicPreview.src = dataURL;
          profilePicPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

/**
 * 🔄 toggleTheme()
 */
function toggleTheme() {
  const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/**
 * ✅ validate()
 */
function validate() {
  let valid = true;
  ['Name','email','phone', 'DOB', 'Address','language','Hobbies','education_10', 'education_12', 'education_Degree','skills'].forEach(id => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      el?.classList.add('invalid');
      valid = false;
    } else {
      el.classList.remove('invalid');
    }
  });
  return valid;
}

/**
 * 🧾 generateResume()
 */
function generateResume() {
  if (!validate()) {
    alert("Please fill all required fields.");
    return;
  }

  const profilePicPreview = document.getElementById('profilePicPreview');
  const savedPic = localStorage.getItem('profilePic');
  if (savedPic && profilePicPreview) {
    profilePicPreview.src = savedPic;
    profilePicPreview.style.display = 'block';
  } else if (profilePicPreview) {
    profilePicPreview.style.display = 'none';
  }

  const fieldsMap = {
    Name: 'Name',
    DOB: 'DOB',
    email: 'email',
    phone: 'phone',
    Address: 'Address',
    language: 'language',
    Hobbies: 'Hobbies',
    education_10: 'education_10', 
    education_12: 'education_12', 
    education_Degree: 'education_Degree',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    certifications: 'Certifications'
  };

  for (const [inputId, sectionId] of Object.entries(fieldsMap)) {
    const input = document.getElementById(inputId);
    const output = document.getElementById('r' + sectionId);
    if (input && output) {
      output.innerText = input.value;
    }
  }

  const resume = document.getElementById('resume');
  if (resume) {
    resume.style.display = 'block';
    initDrag();
    resume.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * 🔃 initDrag()
 */
function initDrag() {
  const sections = document.querySelectorAll('.resume-section');
  sections.forEach(section => {
    section.draggable = true;

    section.ondragstart = e => {
      e.dataTransfer.setData('text/plain', section.dataset.section);
      section.classList.add('dragging');
    };

    section.ondragend = () => section.classList.remove('dragging');

    section.ondragover = e => e.preventDefault();

    section.ondrop = e => {
      e.preventDefault();
      const fromSectionName = e.dataTransfer.getData('text');
      const from = document.querySelector(`[data-section="${fromSectionName}"]`);
      const to = e.currentTarget;
      if (from && to && from !== to) {
        to.parentNode.insertBefore(from, to.nextSibling);
      }
    };
  });
}

/**
 * 🖨️ saveToPDF()
 */
function saveToPDF() {
  const element = document.getElementById('resume');
  if (!element) return;

  element.style.display = 'block';
  window.scrollTo(0, 0);

  setTimeout(() => {
    const opt = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }, 300);
}
