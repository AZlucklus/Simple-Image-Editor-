const fileInput = document.querySelector('.file-input')
const chooseImgBtn = document.querySelector('.choose-img')
const previewImg = document.querySelector('.preview-img img')
const filterOption = document.querySelectorAll('.filter button')
const rotateOption = document.querySelectorAll(".rotate button");
const filterName = document.querySelector('.filter-info .name')
const filterSlider = document.querySelector('.slider input')
const filterValue = document.querySelector(".filter-info .value");
const resetFilterBtn = document.querySelector(".reset-filter")
const saveImgBtn = document.querySelector(".save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0,
  rotate = 0,
  flipVertical = 1,
  flipHorizontal = 1
  

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) 
  scale(${flipHorizontal},${flipVertical})`
  previewImg.style.filter = `
  brightness(${brightness}%) 
  saturate(${saturation}%) 
  invert(${inversion}%) 
  grayscale(${grayscale}%)`; 
}  
const loadImage = () => {
  let file = fileInput.files['0']
  // console.log(file)
  if (!file) return
  previewImg.src = URL.createObjectURL(file)
  previewImg.addEventListener('load', () => {
    document.querySelector('.container').classList.remove('disable')
  })
  resetFilter()
}
filterOption.forEach(option => {
  option.addEventListener('click', () => {
    document.querySelector('.filter .active').classList.remove('active')
    option.classList.add('active')
    filterName.innerText = option.innerText

    if (option.id === 'brightness') {
      filterSlider.max = '200'
      filterSlider.value = brightness
      filterValue.innerText = `${brightness}%`
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
   
  })
})


rotateOption.forEach(option => {
  option.addEventListener('click', () => { 
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "vertical") {
      flipVertical = flipVertical === 1 ? -1 : 1
    }else {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1 
    }
    applyFilter();
  })
})

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`
  const selectedFilter = document.querySelector('.filter .active')
  if (selectedFilter.id === 'brightness') {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  }else {
    grayscale = filterSlider.value;
  }
  applyFilter()
}
const resetFilter = () => {
    brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0,
    rotate = 0,
    flipVertical = 1,
    flipHorizontal = 1;
  filterOption[0].click()
  applyFilter()
 
}

const saveImg = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.height = previewImg.naturalHeight
  canvas.width = previewImg.naturalWidth

  ctx.filter = `
  brightness(${brightness}%) 
  saturate(${saturation}%) 
  invert(${inversion}%) 
  grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 4, canvas.height / 3)
  if (rotate !== 0) {
    ctx.rotate(rotate * Math.PI/180)
  }
  ctx.scale(flipHorizontal, flipVertical)
  ctx.drawImage(previewImg,-canvas.width/5,-canvas.height/4,canvas.width,canvas.height)
  
  document.body.appendChild(canvas)
  const link = document.createElement('a')
  link.download = 'image.png'
  link.href = canvas.toDataURL()
  link.click()
  resetFilter()
  
}

resetFilterBtn.addEventListener('click',resetFilter)
saveImgBtn.addEventListener('click',saveImg)
filterSlider.addEventListener('input',updateFilter)
fileInput.addEventListener('change',loadImage)
chooseImgBtn.addEventListener('click', () => fileInput.click())