// 等待一段时间再执行
const wait = async (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fn() {
  await wait(3000);

  console.log('1111');
}

fn();
