<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import ModifyMusic from '/components/modifyMusic/index.vue'
import {musicDiago} from "/pinia/store.js";
import $ from "jquery";
import {Fetch} from "/api/fetch.js";

const router = useRouter();
const route = useRoute();

// 搜索框歌曲名
let musicName = ref('');

// 网页上显示的表格数据
let displayTable = computed(() => {
    if (musicName.value === '') {
        return songList.value;
    } else {
        return songList.value.filter(function (item, index) {
            if (item.musicName.includes(musicName.value)) {
                return item;
            }
        });
    }
})

let dis = musicDiago()

// 跳转到音乐详情页面
function goToMusicHome(name, time, singer) {
    localStorage.setItem('musicName', name);
    localStorage.setItem('musicTimeLength', time);
    localStorage.setItem('singerName_album', singer);
    let pathUrl = '/songHome/' + name;
    router.push({
        path: pathUrl,
    });
}

// 删除音乐
function handleDelete(name) {
    Fetch('/deleteMusic', {
        method: 'POST',
        body: JSON.stringify({
            musicName: name
        })
    }).then(async res => {
        Fetch('/getSongList', {
            method: 'GET'
        }).then(async (res) => {
            songList.value = await res.json();
        });
    }).catch((err) => {
        console.log(err);
    })
}

// 修改音乐,跳转到修改页面
function handleModify(musicName, singerName, length) {
    localStorage.setItem('modifyMusicName', musicName);
    localStorage.setItem('modifyAlbumName', singerName);
    localStorage.setItem('modifyLength', length);
    dis.open();

}

// 拿到数据库的音乐列表
const songList = ref([]);
onMounted(() => {
    Fetch('/getSongList', {
        method: 'GET'
    }).then(async (res) => {
        songList.value = await res.json();
    });
    if (typeof route.params.musicName != 'undefined') {
        musicName.value = route.params.musicName;
    }
});

// 搜索框响应式
onMounted(function () {
    $(function () {
        $(window).resize(function () {
            // 1512 是 screen.width,屏幕的物理宽度
            let scale = 1050 / 1512
            let newWidth = scale * $(window).width()

            // jquery添加css important最高级语句
            $("#search").css("cssText", "width:" + newWidth + "px !important")
        })
    })
})

//
onMounted(() => {
    $(function () {
        $(window).resize(() => {
            let scale = 560 / 1512
            let newWidth = scale * $(window).width()
            $('div.music').css("cssText", "width:" + newWidth + "px !important")

            let scale2 = 280 / 1512
            let newWidth2 = scale2 * $(window).width()
            $('div.songer').css("cssText", "width:" + newWidth2 + "px !important")
        })

    })

})
</script>
<template>
    <div class="container flex flex-col items-center w-full font-sans">
        <!-- 搜索框 -->
        <div class="bg-[white]  w-[1050px] mt-[40px] rounded-[20px] p-2 flex items-center transition-[width] ease-in-out duration-200"
             id="search">
            <el-icon>
                <i-ep-Search/>
            </el-icon>
            <el-input placeholder="歌曲名" class="input-with-select" :clearable="true" v-model="musicName"
                      input-style="font-family:PingFang SC;">
            </el-input>
        </div>

        <!-- 音乐部分 -->
        <div class="mt-[20px] " ref="musicList">
            <!-- 歌曲头部 -->
            <div class="flex flex-row bg-[#a5f3fc] px-[25px] py-[10px]">
                <div class=" w-[560px] music">歌曲名</div>
                <div class=" w-[280px] songer">专辑/歌手</div>
                <div class=" w-[160px] flex flex-row justify-end">
                    时长
                </div>
                <div class="w-[200px] ">
                    <span class="ml-[113px]"> 操作</span>
                </div>
            </div>

            <!-- 歌曲列表 -->
            <div class="overflow-auto h-[570px]">
                <div class="flex flex-row px-[25px] py-[10px] bg-[#ecfeff] group " v-for="(item, index) of displayTable"
                     :key="index">
                    <div class=" w-[560px] music">{{ item.musicName }}</div>
                    <div class=" w-[280px] songer">{{ item.singerName_album }}</div>
                    <div class=" w-[160px] flex flex-row justify-end items-center">
                        <span>
                            {{ item.timeLength }}
                        </span>
                    </div>
                    <div class="w-[200px] flex justify-end gap-[0_10px] ">
                        <span class=" rounded-2xl bg-[#a5f3fc] px-[5px]" @click="handleDelete(item.musicName)">
                            删除
                        </span>
                        <span class="rounded-2xl bg-[#a5f3fc] px-[5px]"
                              @click="goToMusicHome(item.musicName, item.timeLength, item.singerName_album)">
                            详情
                        </span>
                        <span class="rounded-2xl bg-[#a5f3fc] px-[5px]"
                              @click="handleModify(item.musicName, item.singerName_album, item.timeLength)">
                            修改
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <modify-music></modify-music>
    </div>
</template>
<style scoped>
:deep(.el-icon) {
    color: #64748b !important;
}


:deep(.el-input__wrapper) {
    box-shadow: none !important;
}
</style>
