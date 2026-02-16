console.log('script loaded');

const galleries = {
  echo: [
    'img/echo-1.gif',
    'img/echo-2.gif',
    'img/echo-3.png'
  ],
  pet: [
    'img/pet-1.png',
    'img/pet-2.png',
    'img/pet-3.png'
  ],
  superpowers: [
    'img/super-1.gif',
    'img/super-2.gif'
  ],
  branding: [
    'img/zvuk1.gif',
    'img/zvuk6.png',
    'img/zvuk2.png',
    'img/zvuk3.png',
    'img/zvuk4.png',
    'img/zvuk5.png',
    'img/zvuk7.png',
    'img/zvuk8.png'
  ],
    zine: [
    'img/electronica/1.1.png',
    'img/electronica/1.png',
    'img/electronica/2.png',
    'img/electronica/3.png',
    'img/electronica/4.png',
    'img/electronica/5.png',
    'img/electronica/6.png',
    'img/electronica/7.png',
    'img/electronica/8.png',
    'img/electronica/8.1.png',
    'img/electronica/9.png',
    'img/electronica/10.png'
  ],
  postcards: [
    'img/postcards-preview.png',
    'img/postcards-1.png',
    'img/postcards-2.png',
    'img/postcards-3.png',
    'img/postcards-4.png',
    'img/postcards-5.png'
  ],
  film: [
    'img/film.png',
    'img/film2.png'
  ],
  type1: [
    'img/type-1.png',
    'img/type-2.png',
    'img/type-3.png',
    'img/type-4.png',
    'img/type-5.png',
    'img/type-6.png'
  ],
  animals: [
    'img/animals1.png',
    'img/animals2.png',
    'img/animals3.png'
  ],
  cats: [
    'img/cats1.png',
    'img/cats2.png',
    'img/cats3.png'
  ],
};

let currentIndex = 0;
let currentProject = null;

function updateGallery(project) {
  const images = galleries[project];
  if (!images) return;

  const activeContent = document.querySelector(
    `.project-content[data-project="${project}"]`
  );

  const img = activeContent.querySelector('.gallery-image');

  currentIndex = 0;
  currentProject = project;
  img.src = images[currentIndex];
}

// ===== ELEMENTS =====
const categories = document.querySelectorAll('.category');
const projectLists = document.querySelectorAll('.project-list');
const projects = document.querySelectorAll('.project');
const contents = document.querySelectorAll('.project-content');
const preview = document.querySelector('.hover-preview');
const previewImg = preview?.querySelector('img'); // Опциональная цепочка на случай, если элемент не найден

// Проверка наличия элементов
if (!preview || !previewImg) {
  console.warn('Hover preview elements not found. Hover functionality will be disabled.');
}

// ===== HELPERS =====
function clearActive(elements) {
  elements.forEach(el => el.classList.remove('active'));
}

function showCategoryProjects(category) {
  projectLists.forEach(list => {
    if (list.dataset.category === category) {
      list.style.display = 'flex';
      // Активируем первый проект в категории
      const firstProject = list.querySelector('.project');
      if (firstProject && !document.querySelector('.project.active')) {
        firstProject.click();
      }
    } else {
      list.style.display = 'none';
    }
  });
}

// ===== CATEGORY CLICK =====
categories.forEach(category => {
  category.addEventListener('click', () => {
    const selectedCategory = category.dataset.category;
    
    // underline category
    clearActive(categories);
    category.classList.add('active');
    
    // show correct project list
    showCategoryProjects(selectedCategory);
  });
});

// ===== PROJECT CLICK =====
projects.forEach(project => {
  project.addEventListener('click', () => {
    const selectedProject = project.dataset.project;
    
    console.log('Clicked project:', selectedProject);
    
    // underline project
    clearActive(projects);
    project.classList.add('active');
    
    // hide all content blocks first
    contents.forEach(content => {
      content.classList.remove('active');
      content.style.display = 'none';
    });
    
    // show only the selected content
    const activeContent = document.querySelector(`.project-content[data-project="${selectedProject}"]`);
    if (activeContent) {
      activeContent.classList.add('active');
      updateGallery(selectedProject);
      activeContent.style.display = 'block';
      console.log('Showing content for:', selectedProject);
    }
  });
});

// ===== HOVER PREVIEW =====
if (preview && previewImg) {
  projects.forEach(project => {
    const imgSrc = project.dataset.preview;
    
    if (!imgSrc) {
      console.warn(`Project "${project.textContent}" has no data-preview attribute`);
      return;
    }
    
    // Предзагрузка изображений для плавного отображения
    const img = new Image();
    img.src = imgSrc;
    
    project.addEventListener('mouseenter', () => {
      previewImg.src = imgSrc;
      preview.style.opacity = '1';
      preview.style.transform = 'scale(1)';
    });
    
    project.addEventListener('mousemove', (e) => {
      // Отступ от курсора
      const offsetX = 20;
      const offsetY = 20;
      
      // Позиционирование preview
      let left = e.clientX + offsetX;
      let top = e.clientY + offsetY;
      
      // Проверка, чтобы preview не выходил за границы окна
      const previewWidth = preview.offsetWidth;
      const previewHeight = preview.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      if (left + previewWidth > windowWidth) {
        left = e.clientX - previewWidth - offsetX;
      }
      
      if (top + previewHeight > windowHeight) {
        top = e.clientY - previewHeight - offsetY;
      }
      
      preview.style.left = `${left}px`;
      preview.style.top = `${top}px`;
    });
    
    project.addEventListener('mouseleave', () => {
      preview.style.opacity = '0';
      preview.style.transform = 'scale(0.98)';
    });
  });
}

// ===== DEFAULT STATE =====
// Автоматически активируем "web" при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const defaultCategory = document.querySelector('.category[data-category="web"]');
  if (defaultCategory) {
    defaultCategory.click();
  }
  
  // Показываем hover preview только если есть изображения
  if (previewImg) {
    // Устанавливаем начальную позицию вне экрана
    preview.style.left = '-1000px';
    preview.style.top = '-1000px';
  }
});

// ===== RESPONSIVE: Обновляем позицию при изменении размера окна =====
window.addEventListener('resize', () => {
  // При изменении размера окна скрываем preview
  if (preview) {
    preview.style.opacity = '0';
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('gallery-arrow')) return;

  const isNext = e.target.classList.contains('next');
  const images = galleries[currentProject];
  if (!images) return;

  currentIndex = isNext
    ? (currentIndex + 1) % images.length
    : (currentIndex - 1 + images.length) % images.length;

  const activeImg = document.querySelector(
    `.project-content.active .gallery-image`
  );

  activeImg.src = images[currentIndex];
});
