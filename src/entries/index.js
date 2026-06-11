// ═══ Import store dulu, expose ke window ═══
import {
  fetchPortalData, savePortalData,
  uploadImage, uploadPdf,
  genId, formatSize, fileToBase64
} from '../../js/store.js'

window.fetchPortalData = fetchPortalData;
window.savePortalData  = savePortalData;
window.uploadImage     = uploadImage;
window.uploadPdf       = uploadPdf;
window.genId           = genId;
window.formatSize      = formatSize;
window.fileToBase64    = fileToBase64;

// ═══ CSS ═══
import '../../css/base.css'
import '../../css/animations.css'
import '../../css/header.css'
import '../../css/slider.css'
import '../../css/popup.css'
import '../../css/content.css'
import '../../css/footer.css'

import '../../css/layanan-popup.css'
import '../../css/kontak.css'
import '../../css/ai-search.css'

// ═══ JS lainnya ═══
import '../../js/kontak.js'
import '../../js/header.js'
import '../../js/slider.js'
import '../../js/popup.js'
import '../../js/news.js'
import '../../js/kb.js'

import '../../js/app.js'
import '../../js/layanan-popup.js'
import '../../js/ai-search.js'