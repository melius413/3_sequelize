function onChg(id) { // 브라우저는 es5 async 못씀
    // console.log(axios.get('/board/' + id)); // pending, => 성공하면 resolved, then이 처리함
    // axios 사용
    // 프로미스
    axios.get('/board/' + id).then(function (res) { // await 형태라면 ?? 숙제
        // console.log(res);
        document.querySelector("#id").value = res.data.id;
        document.querySelector("#title").value = res.data.title;
        document.querySelector("#comment").value = res.data.comment;
        document.querySelector("#writer").value = res.data.writer;
    }).catch(function (err) {
        console.error(err);
    });
}
