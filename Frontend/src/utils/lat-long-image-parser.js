import piexif from "piexifjs";

function extractGPSData(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.match("image.*")) {
      reject(new Error("File is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const exifData = piexif.load(e.target.result);
        const gps = exifData.GPS;

        if (
          !gps ||
          !gps[piexif.GPSIFD.GPSLatitude] ||
          !gps[piexif.GPSIFD.GPSLongitude]
        ) {
          resolve(null);
          return;
        }

        const toDecimal = (dms) => {
          const [d, m, s] = dms.map(([num, denom]) => num / denom);
          return d + m / 60 + s / 3600;
        };

        let lat = toDecimal(gps[piexif.GPSIFD.GPSLatitude]);
        let lon = toDecimal(gps[piexif.GPSIFD.GPSLongitude]);

        if (gps[piexif.GPSIFD.GPSLatitudeRef] === "S") lat *= -1;
        if (gps[piexif.GPSIFD.GPSLongitudeRef] === "W") lon *= -1;

        resolve({ latitude: lat, longitude: lon });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default extractGPSData;
