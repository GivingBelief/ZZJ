var vm = new Vue({
    el: '#app',
    data: {
        li_active_num: 0,
        albummidArray: [], //最新图片数组
        songmidArray: [],//最新歌曲源数组
        playArray: [],//当前播放的歌曲数组
    },
    computed: {},
    watch: {},

    mounted() {
        var that = this
        $(document).ready(function () {
            let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923';
            $.ajax({
                url: url,
                type: "get",
                dataType: 'jsonp',
                jsonp: "jsonpCallback",
                scriptCharset: 'GBK',//解决中文乱码
                success: function (data) {
                    // console.log(data.songlist[2].data.singer);
                    // 图片路径
                    for (let i = 0; i < data.songlist.length; i++) {
                        var res = {};
                        res.albummid = data.songlist[i].data.albummid
                        res.songmid = data.songlist[i].data.songmid
                        res.albumname = data.songlist[i].data.albumname
                        res.albumid = data.songlist[i].data.albumid
                        res.singer = data.songlist[i].data.singer
                        that.albummidArray.push(res)
                    }
                    // 歌曲源路径
                    for (let j = 0; j < data.songlist.length; j++) {
                        that.songmidArray.push(data.songlist[j].data.songmid)
                    }
                },
                error: function (e) {
                    console.log('error');
                }
            });
        });
    },

    methods: {
        //点击最新里面的每一项歌曲
        list_song_click(music_data) {
            console.log(music_data);
            let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22' + music_data.songmid + '%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D'
            $.ajax({
                url: url,
                type: "get",
                dataType: 'jsonp',
                jsonp: "callback",
                jsonpCallback: "callback",
                scriptCharset: 'GBK',//解决中文乱码
                success: (res) => {
                    var data = {};
                    data.sip = res.req_0.data.sip
                    data.purl = res.req_0.data.midurlinfo[0].purl
                    this.playArray.push(data)
                    localStorage.setItem('playArray', JSON.stringify(this.playArray)) //储存播放地址
                    JSON.parse(localStorage.getItem('playArray'))
                    localStorage.setItem('every_music_data', JSON.stringify(music_data)) //点击播放音乐的一些值
                    window.location.href = './play.html'
                },
                error: function (e) {
                    console.log('error');
                }
            });
        },
        // 图片路径
        getImgUrl(icon) {
            return "http://y.gtimg.cn/music/photo_new/T002R180x180M000" + icon + ".jpg"
        },
        //最新按钮事件
        music_click() {
            this.li_active_num = 0
        },
        //推荐按钮事件
        recommend_click() {
            this.li_active_num = 1
        },
        //搜索按钮事件
        search_click() {
            this.li_active_num = 2
        },
        //世界按钮事件
        We_click() {
            this.li_active_num = 3
        },
    }
})
