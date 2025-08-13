export function mapVodList(list = []) {
  return list.map((vod) => {
    // Helper to parse first play url from MACCMS play url string
    function firstPlayUrl(str = '') {
      if (!str) return ''
      const group = str.split('$$')[0]
      const first = group.split('#')[0]
      const url = first.includes('$') ? first.substring(first.lastIndexOf('$') + 1) : first
      return url.trim().startsWith('http') ? url.trim() : ''
    }
    return {
      id: String(vod.vod_id),
      aweme_id: String(vod.vod_id),
      desc: vod.vod_name,
      duration: Number(vod.vod_duration) || 0,
      create_time: Math.floor(new Date(vod.vod_pubdate || vod.vod_time || Date.now()).getTime()/1000),
      statistics: { digg_count: Number(vod.vod_hits) || 0 },
      video: {
        cover: { url_list: [vod.vod_pic || ''] },
        play_addr: { url_list: [firstPlayUrl(vod.vod_play_url)] }
      },
      author: {
        nickname: (vod.vod_actor || '').split(',')[0] || '未知',
        avatar_168x168: { url_list: [''] }
      },
      canDownload: false,
      is_top: false
    }
  })
}