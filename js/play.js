var vm = new Vue({
    el: '#app',
    data: {
        music_data: [],
        album_name: '', //演唱歌名
        singer_name: '', //演唱者
        albummid: '',//图片值
        songmid: '',//歌曲id
        new_start_time: '00:00', // 初始开始时间
        new_end_time: '03:15', // 初始开始时间
        operatewidth: 0,//进度条的进度值
        start_time: 0,// 开始时间增加值
        timer: null,
        play_or_suspend: false
    },
    computed: {},
    watch: {},

    mounted() {
        if (localStorage.getItem('every_music_data')) {
            // 演唱歌名,演唱者
            this.music_data.push(JSON.parse(localStorage.getItem('every_music_data')))
            this.album_name = this.music_data[0].albumname
            this.albummid = this.music_data[0].albummid
            this.songmid = this.music_data[0].songmid
            console.log(this.albummid);
            this.getImgUrl() // 拼接获取小图片地址
            $('#background_img').css('background-image', 'url(http://y.gtimg.cn/music/photo_new/T002R180x180M000' + this.albummid + '.jpg)') // 修改大背景图地址
            var arrays = []
            if (this.music_data[0].singer.length > 1) {
                for (let i = 0; i < this.music_data[0].singer.length; i++) {
                    var not_last = this.music_data[0].singer[i].name + ' / '
                    arrays.push(not_last)
                }
                arrays.push(arrays.pop().replace(/[ / ]/g, ''))
                for (let j = 0; j < arrays.length; j++) {
                    this.singer_name += arrays[j]
                }
            } else {
                this.singer_name = this.music_data[0].singer[0].name
            }


            // let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=' + this.songmid + '&format=json&nobase64=1';
            // $.ajax({
            //         url: url,
            //     type: "get",
            //     dataType: 'jsonp',
            //     jsonp: "callback",
            //     jsonpCallback: "callback",
            //     headers:{
            //         referer:'https://c.y.qq.com/',
            //         host:'c.y.qq.com'
            //     },
            //
            //     success: (res) => {
            //         console.log(res);
            //     },
            //     error: function (e) {
            //         console.log('error');
            //     }
            // });
        } else {
            alert('error')
        }
    },

    methods: {
        // 图片路径
        getImgUrl() {
            return "http://y.gtimg.cn/music/photo_new/T002R180x180M000" + this.albummid + ".jpg"
        },

        play_click() {
            this.play_or_suspend = !this.play_or_suspend;
            if (this.play_or_suspend == true) {
                this.timer = setInterval(() => {
                    this.showTime(++this.start_time)
                    this.$nextTick(() => {
                        this.operatewidth = this.$refs.line.offsetWidth / this.ChangeStrToMinutes(this.new_end_time) * this.start_time
                    })
                }, 1000)
            } else {
                clearInterval(this.timer)
            }

            let url = JSON.parse(localStorage.getItem('playArray'))
            // console.log(url[0].sip[0] + url[0].purl);
            $.ajax({
                url: url[0].sip[0]+url[0].purl,
                type: "get",
                dataType: 'jsonp',
                jsonp: "callback",
                jsonpCallback: "callback",
                success: (res) => {
                    console.log(res);
                },
                error: function (e) {
                    console.log('error');
                }
            });
        },
        // 数字转化为时间(数字=>00:00)
        showTime(iTimelLength) {
            var str = "";
            var s = parseInt(iTimelLength % 60);
            var m = parseInt(((iTimelLength - s) / 60) % 60);
            str += (m >= 10 ? m + ":" : m > 0 ? "0" + m + ":" : "00:");
            str += (s >= 10 ? s : s > 0 ? "0" + s : "00");
            this.new_start_time = str
            // 进度条放完关闭定时器
            // this.ChangeStrToMinutes(this.new_start_time) 歌曲进度
            // this.ChangeStrToMinutes(this.new_start_time) 歌曲长度
            if (this.ChangeStrToMinutes(this.new_start_time) >= this.ChangeStrToMinutes(this.new_end_time)) {
                clearInterval(this.timer)
            }
        },
        // 时间转化为数字(00:00=>数字)
        ChangeStrToMinutes(str) {
            var arrminutes = str.split(":");
            if (arrminutes.length == 2) {
                var minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
                return minutes
            } else {
                return 0;
            }
        }
    }
})
