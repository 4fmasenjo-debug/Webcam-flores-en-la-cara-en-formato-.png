const video = document.getElementById("video");
let lirioImage = new Image();
let florCerezoImage = new Image();
let convertedImage = new Image();
let florMiaImage = new Image();
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    // Imagenes a usar
    loadImage('lirio.png'),
    loadImage('flor_cerezo.png'),
    loadImage('converted_image.png'),
    loadImage('flor_mia.png'),
]).then(async (results) => {
    lirioImage = results[2];
    florCerezoImage = results[3];
    convertedImage = results[4];
    florMiaImage = results[5];
    startWebcam();
}).catch(err => {
  console.error("Error cargando modelos o imágenes:", err);
});
function startWebcam() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => console.error(err));
}
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.appendChild(canvas);
  faceapi.matchDimensions(canvas, { width: video.width, height: video.height });
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resized = faceapi.resizeResults(detections, { width: video.width, height: video.height });
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    resized.forEach(result => {
      const landmarks = result.landmarks;
      drawFaceDecorations(ctx, landmarks);
    });
  }, 100);
});

/**
 * Dibuja varias imágenes de flores en ubicaciones de referencia faciales.
 * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado 2D del canvas.
 * @param {faceapi.FaceLandmarks68} landmarks - Los puntos de referencia faciales detectados.
 */
function drawFaceDecorations(ctx, landmarks) {
  if (!lirioImage.complete || lirioImage.naturalWidth === 0 ||
      !florCerezoImage.complete || florCerezoImage.naturalWidth === 0 ||
      !convertedImage.complete || convertedImage.naturalWidth === 0 ||
      !florMiaImage.complete || florMiaImage.naturalWidth === 0) {
    return;
  }

  const baseImageScale = 0.20; // Ajustado de 0.15 a 0.20 para que sean un poco más grandes

  const imageWidth = lirioImage.naturalWidth; 
  const imageHeight = lirioImage.naturalHeight;

  const jaw = landmarks.getJawOutline();
  const leftCheek = jaw[3];
  const rightCheek = jaw[13];
  const chin = jaw[8];

  const leftEyeBrow = landmarks.getLeftEyeBrow();
  const rightEyeBrow = landmarks.getRightEyeBrow();

  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const mouth = landmarks.getMouth();

  const faceWidth = rightCheek.x - leftCheek.x;
  const faceHeight = chin.y - jaw[0].y;

  // --- Lirios (imagen original) ---

  // Lirio en el mentón
  drawImageWithTransform(ctx, lirioImage, {
    translate: [chin.x - faceWidth * 0.15, chin.y + faceHeight * 0.15],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.5,
    rotate: 0,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirios en mejillas
  // Lirio original en mejilla izquierda
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftCheek.x - faceWidth * 0.07, leftCheek.y - faceHeight * 0.03],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.2,
    rotate: 0, // Sin rotación adicional
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });
  // Lirio original en mejilla derecha
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightCheek.x + faceWidth * 0.07, rightCheek.y - faceHeight * 0.03],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.2,
    rotate: 0, // Sin rotación adicional
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });


  // Lirios en cejas
  // Lirio original en ceja izquierda
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftEyeBrow[2].x, leftEyeBrow[2].y - faceHeight * 0.08],
    scale: baseImageScale * 0.75 * (faceWidth / imageWidth) * 0.8,
    rotate: -75,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });
  // Lirio original en ceja derecha
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightEyeBrow[2].x, rightEyeBrow[2].y - faceHeight * 0.08],
    scale: baseImageScale * 0.75 * (faceWidth / imageWidth) * 0.8,
    rotate: 70,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });


  // Lirios sobre nariz
  drawImageWithTransform(ctx, lirioImage, {
    translate: [nose[3].x, nose[3].y - faceHeight * 0.04],
    scale: baseImageScale * 0.75 * (faceWidth / imageWidth) * 0.7,
    rotate: 15,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });
  drawImageWithTransform(ctx, lirioImage, {
    translate: [nose[4].x, nose[4].y - faceHeight * 0.06],
    scale: baseImageScale * 0.65 * (faceWidth / imageWidth) * 0.7,
    rotate: -15,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirios en ojos
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftEye[0].x - faceWidth * 0.04, leftEye[0].y - faceHeight * 0.05],
    scale: baseImageScale * 0.5 * (faceWidth / imageWidth) * 0.6,
    rotate: 20,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightEye[3].x + faceWidth * 0.04, rightEye[3].y - faceHeight * 0.05],
    scale: baseImageScale * 0.5 * (faceWidth / imageWidth) * 0.6,
    rotate: -20,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirios en boca
  drawImageWithTransform(ctx, lirioImage, {
    translate: [mouth[6].x, mouth[6].y + faceHeight * 0.02],
    scale: baseImageScale * 0.65 * (faceWidth / imageWidth) * 0.7,
    rotate: 0,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la comisura interna del ojo izquierdo
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftEye[3].x, leftEye[3].y],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.5,
    rotate: 10,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la comisura externa del ojo izquierdo
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftEye[0].x - faceWidth * 0.02, leftEye[0].y],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.5,
    rotate: -10,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la comisura interna del ojo derecho
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightEye[3].x, rightEye[3].y],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.5,
    rotate: -10,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la comisura externa del ojo derecho
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightEye[0].x + faceWidth * 0.02, rightEye[0].y],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.5,
    rotate: 10,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en el lado izquierdo de la barbilla
  drawImageWithTransform(ctx, lirioImage, {
    translate: [chin.x - faceWidth * 0.08, chin.y + faceHeight * 0.08],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.0,
    rotate: -5,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en el lado derecho de la barbilla
  drawImageWithTransform(ctx, lirioImage, {
    translate: [chin.x + faceWidth * 0.08, chin.y + faceHeight * 0.08],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.0,
    rotate: 5,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la frente (parte superior izquierda)
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftEyeBrow[0].x, leftEyeBrow[0].y - faceHeight * 0.15],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.8,
    rotate: -30,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la frente (parte superior derecha)
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightEyeBrow[4].x, rightEyeBrow[4].y - faceHeight * 0.15],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.8,
    rotate: 30,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en el puente de la nariz
  drawImageWithTransform(ctx, lirioImage, {
    translate: [nose[0].x, nose[0].y - faceHeight * 0.05],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.6,
    rotate: 0,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en el centro del labio superior
  drawImageWithTransform(ctx, lirioImage, {
    translate: [mouth[2].x, mouth[2].y - faceHeight * 0.01],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.5,
    rotate: 0,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en el centro del labio inferior
  drawImageWithTransform(ctx, lirioImage, {
    translate: [mouth[8].x, mouth[8].y + faceHeight * 0.01],
    scale: baseImageScale * (faceWidth / imageWidth) * 0.5,
    rotate: 0,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la mejilla izquierda (más abajo)
  drawImageWithTransform(ctx, lirioImage, {
    translate: [leftCheek.x - faceWidth * 0.1, leftCheek.y + faceHeight * 0.05],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.0,
    rotate: 45,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // Lirio en la mejilla derecha (más abajo)
  drawImageWithTransform(ctx, lirioImage, {
    translate: [rightCheek.x + faceWidth * 0.1, rightCheek.y + faceHeight * 0.05],
    scale: baseImageScale * (faceWidth / imageWidth) * 1.0,
    rotate: -45,
    offsetX: imageWidth / 2,
    offsetY: imageHeight / 2
  });

  // --- Flor Cerezo (flor_cerezo.png) ---

  // Flor Cerezo en la sien izquierda
  drawImageWithTransform(ctx, florCerezoImage, {
    translate: [landmarks.getLeftEyeBrow()[4].x - faceWidth * 0.05, landmarks.getLeftEyeBrow()[4].y - faceHeight * 0.1],
    scale: baseImageScale * (faceWidth / florCerezoImage.naturalWidth) * 1.0,
    rotate: -25,
    offsetX: florCerezoImage.naturalWidth / 2,
    offsetY: florCerezoImage.naturalHeight / 2
  });

  // Flor Cerezo en la sien derecha
  drawImageWithTransform(ctx, florCerezoImage, {
    translate: [landmarks.getRightEyeBrow()[0].x + faceWidth * 0.05, landmarks.getRightEyeBrow()[0].y - faceHeight * 0.1],
    scale: baseImageScale * (faceWidth / florCerezoImage.naturalWidth) * 1.0,
    rotate: 25,
    offsetX: florCerezoImage.naturalWidth / 2,
    offsetY: florCerezoImage.naturalHeight / 2
  });

  // Flor Cerezo cerca de la oreja izquierda
  drawImageWithTransform(ctx, florCerezoImage, {
    translate: [jaw[0].x - faceWidth * 0.1, jaw[0].y + faceHeight * 0.2],
    scale: baseImageScale * (faceWidth / florCerezoImage.naturalWidth) * 0.9,
    rotate: -90,
    offsetX: florCerezoImage.naturalWidth / 2,
    offsetY: florCerezoImage.naturalHeight / 2
  });

  // Flor Cerezo cerca de la oreja derecha
  drawImageWithTransform(ctx, florCerezoImage, {
    translate: [jaw[16].x + faceWidth * 0.1, jaw[16].y + faceHeight * 0.2],
    scale: baseImageScale * (faceWidth / florCerezoImage.naturalWidth) * 0.9,
    rotate: 90,
    offsetX: florCerezoImage.naturalWidth / 2,
    offsetY: florCerezoImage.naturalHeight / 2
  });

  // --- Converted Image (converted_image.png) ---

  // Converted Image en el centro de la frente
  drawImageWithTransform(ctx, convertedImage, {
    translate: [landmarks.getJawOutline()[0].x + faceWidth / 2, landmarks.getLeftEyeBrow()[0].y - faceHeight * 0.1],
    scale: baseImageScale * (faceWidth / convertedImage.naturalWidth) * 1.2,
    rotate: 15,
    offsetX: convertedImage.naturalWidth / 2,
    offsetY: convertedImage.naturalHeight / 2
  });

  // Converted Image en los pómulos
  drawImageWithTransform(ctx, convertedImage, {
    translate: [leftCheek.x - faceWidth * 0.1, leftCheek.y + faceHeight * 0.15],
    scale: baseImageScale * (faceWidth / convertedImage.naturalWidth) * 0.8,
    rotate: -30,
    offsetX: convertedImage.naturalWidth / 2,
    offsetY: convertedImage.naturalHeight / 2
  });
  drawImageWithTransform(ctx, convertedImage, {
    translate: [rightCheek.x + faceWidth * 0.1, rightCheek.y + faceHeight * 0.15],
    scale: baseImageScale * (faceWidth / convertedImage.naturalWidth) * 0.8,
    rotate: 30,
    offsetX: convertedImage.naturalWidth / 2,
    offsetY: convertedImage.naturalHeight / 2
  });

  // --- Flor Mia (flor_mia.png) ---

  // Flor Mia sobre los labios (parte superior e inferior)
  drawImageWithTransform(ctx, florMiaImage, {
    translate: [mouth[4].x, mouth[4].y - faceHeight * 0.03],
    scale: baseImageScale * (faceWidth / florMiaImage.naturalWidth) * 0.7,
    rotate: 0,
    offsetX: florMiaImage.naturalWidth / 2,
    offsetY: florMiaImage.naturalHeight / 2
  });
  drawImageWithTransform(ctx, florMiaImage, {
    translate: [mouth[10].x, mouth[10].y + faceHeight * 0.03],
    scale: baseImageScale * (faceWidth / florMiaImage.naturalWidth) * 0.7,
    rotate: 180,
    offsetX: florMiaImage.naturalWidth / 2,
    offsetY: florMiaImage.naturalHeight / 2
  });

  // Flor Mia a los lados de la nariz
  drawImageWithTransform(ctx, florMiaImage, {
    translate: [nose[1].x - faceWidth * 0.03, nose[1].y],
    scale: baseImageScale * (faceWidth / florMiaImage.naturalWidth) * 0.6,
    rotate: -45,
    offsetX: florMiaImage.naturalWidth / 2,
    offsetY: florMiaImage.naturalHeight / 2
  });
  drawImageWithTransform(ctx, florMiaImage, {
    translate: [nose[5].x + faceWidth * 0.03, nose[5].y],
    scale: baseImageScale * (faceWidth / florMiaImage.naturalWidth) * 0.6,
    rotate: 45,
    offsetX: florMiaImage.naturalWidth / 2,
    offsetY: florMiaImage.naturalHeight / 2
  });
}

/**
 * Dibuja una imagen con traslación, rotación y escalado.
 * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado 2D.
 * @param {HTMLImageElement} image - La imagen a dibujar.
 * @param {object} transform - Objeto que contiene translate, rotate, scale, offsetX, offsetY.
 */
function drawImageWithTransform(ctx, image, transform = {}) {
  const { translate = [0, 0], rotate = 0, scale = 1, offsetX = 0, offsetY = 0 } = transform;

  ctx.save(); 
  ctx.translate(translate[0], translate[1]); 
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(scale, scale); 

  ctx.drawImage(image, -offsetX, -offsetY);

  ctx.restore();
}