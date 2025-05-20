<script setup>
import { ref, reactive } from 'vue';
import JSZip from 'jszip';

const error = ref('')
const isExtracting = ref(false)
const len = ref(-1)
let selectedFile = reactive({
    files: null,
    source: null
})

function handleFileChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        selectedFile.files = files[0];
        console.log(selectedFile.files.name)
        error.value = null;
        selectedFile.source = {};
    }
}
    
async function extractZip() {
    if (!selectedFile.files) {
        error.value = '请先选择 ZIP 文件';
        return;
    }
    
    isExtracting.value = true;
    error.value = null;
    selectedFile.source = {};

    // 检查是否图像文件
    const check = (name) => {
        const fileName = name.toLowerCase();
        return fileName.endsWith('.jpg') || 
                fileName.endsWith('.jpeg') || 
                fileName.endsWith('.png') || 
                fileName.endsWith('.gif') ||
                fileName.endsWith('.webp');
    }
    
    try {
        const zip = new JSZip();
        const content = await zip.loadAsync(selectedFile.files);
        // console.log(content.files, '内容')

        // 获取所有文件
        const files = {}
        let new_files = {}
        for (let i in content.files) {
            let name = content.files[i].name.split('/')
            if (content.files[i].dir && !files[name[0]] && name.length <= 2) {
                files[name[0]] = {
                    img: []
                }
            } else {
                if (files[name[0]] && check(content.files[i].name) && name.length <= 2) {
                    const blob = await content.files[i].async('blob');
                    const url = URL.createObjectURL(blob);
                    files[name[0]].img.push({
                        file: content.files[i],
                        url
                    })
                }
            }
        }
        for (let i in files) {
            if (files[i].img.length > 0) {
                new_files[i] = files[i]
            }
        }
        selectedFile.source = new_files
        len.value = Object.keys(selectedFile.source).length
        console.log(selectedFile.source, '新文件列表', Object.keys(selectedFile.source).length)
    } catch (err) {
        console.error('解压 ZIP 文件时出错:', err);
        error.value = '解压文件失败: ' + err.message;
    } finally {
        isExtracting.value = false;
    }
}
    
// function formatSize(bytes) {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// }
</script>

<template>
    <div class="zip-demo">
        <h1>JSZip 解压图像资源演示</h1>
        
        <div class="upload-area">
            <input 
                type="file" 
                id="zipFile" 
                accept=".zip" 
                @change="handleFileChange"
            />
            <label for="zipFile" class="upload-btn">
                选择 ZIP 文件
            </label>
            <p v-if="selectedFile.files">已选择文件: {{ selectedFile.files.name }}</p>
        </div>
        
        <button 
            @click="extractZip" 
            :disabled="!selectedFile.files || isExtracting"
            class="extract-btn"
        >
            {{ isExtracting ? '解压中...' : '解压文件' }}
        </button>
        
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
        <div v-if="len > 0" class="image-gallery">
            <h2>解压的图像资源 ({{ len }} 张)</h2>
            <div class="image-grid">
                <div v-for="(item, index) in selectedFile.source" :key="index" class="image-item">
                    <p>{{ index }}</p>
                    <ul>
                        <li v-for="(image, idx) in item.img" :key="idx">
                            <img :src="image.url" :alt="image.name" class="preview-image" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.zip-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.upload-area {
  margin: 20px 0;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  text-align: center;
}

input[type="file"] {
  display: none;
}

.upload-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #45a049;
}

.extract-btn {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.extract-btn:hover:not(:disabled) {
  background-color: #0b7dda;
}

.extract-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  margin: 15px 0;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 5px;
}

.image-gallery {
  margin-top: 30px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.image-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 150px;
  object-fit: contain;
}

.image-name {
  margin: 5px 0;
  font-size: 14px;
  word-break: break-all;
}

.image-size {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style>
