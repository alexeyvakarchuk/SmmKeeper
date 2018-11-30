module.exports = maxDelay =>
  new Promise(res => {
    const delay = Math.floor(Math.random() * maxDelay) + 1;

    console.log("delay ::: ", delay);

    setTimeout(res, delay * 1000);
  });
