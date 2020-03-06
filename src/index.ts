import openUrl from './lib/openUrl';
import axios, { AxiosInstance } from 'axios';
import { promises as fs } from 'fs';
import readLine from 'readline';

let url: string = 'https://www.yogamala.cn/app/index.php?i=2&c=entry&m=zh_gjhdbm&do=video&ac=info&op=play&id=1050&v=1118&wxref=mp.weixin.qq.com&from=singlemessage&isappinstalled=0#wechat_redirect';

const loginReg = /'请用微信扫码登录',\s*?'(.+?)'/,
      qrCodeReg = /\<img.+? src\=\"(.+?)\"/;

function readStdIn(str: string): Promise<any>{
    let rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((res) => {
        rl.question(str, (ans) => {
            res(ans);
            rl.close();
        });
    });
}

async function main(axiosIns?: AxiosInstance): Promise<void>{
    let loginedAxios: AxiosInstance = axiosIns || axios.create({
        headers: {
            'cookie': 'zh_gjhdbm=a%3A20%3A%7Bs%3A2%3A%22id%22%3Bs%3A5%3A%2257470%22%3Bs%3A4%3A%22name%22%3Bs%3A5%3A%22Xecus%22%3Bs%3A9%3A%22join_time%22%3Bs%3A10%3A%221578656240%22%3Bs%3A3%3A%22img%22%3Bs%3A132%3A%22http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FUictFQuO0UZo0ciahoNy2jic3S45BPN5K0VQhkFicQAT1Odibg5zrf7EE2RqhVww0d1dsVvOMRC6FhuuUCkkaoPIyCA%2F132%22%3Bs%3A6%3A%22openid%22%3Bs%3A0%3A%22%22%3Bs%3A10%3A%22openid_gzh%22%3Bs%3A28%3A%22oKeB_5qi24uK7uAqu98dIcb0zShU%22%3Bs%3A7%3A%22unionid%22%3Bs%3A28%3A%22o_8np1enqyvnha5F1Rdbth3e2B6E%22%3Bs%3A7%3A%22uniacid%22%3Bs%3A0%3A%22%22%3Bs%3A5%3A%22money%22%3Bs%3A4%3A%220.00%22%3Bs%3A4%3A%22item%22%3Bs%3A1%3A%220%22%3Bs%3A7%3A%22rz_type%22%3Bs%3A1%3A%220%22%3Bs%3A9%3A%22link_name%22%3Bs%3A0%3A%22%22%3Bs%3A8%3A%22link_tel%22%3Bs%3A0%3A%22%22%3Bs%3A8%3A%22is_check%22%3Bs%3A1%3A%220%22%3Bs%3A5%3A%22click%22%3Bs%3A1%3A%220%22%3Bs%3A6%3A%22dibiao%22%3Bs%3A1%3A%220%22%3Bs%3A4%3A%22city%22%3Bs%3A0%3A%22%22%3Bs%3A8%3A%22province%22%3Bs%3A0%3A%22%22%3Bs%3A7%3A%22country%22%3Bs%3A0%3A%22%22%3Bs%3A8%3A%22isupload%22%3Bs%3A1%3A%220%22%3B%7D; PHPSESSID=09806f5d89b9aee7946265bb8f35ebf6'
        }
    })

    console.log(loginedAxios.head)

    let response = await loginedAxios.get(url),
        pageData: string = response.data,
        loginResult = pageData.match(loginReg);

    if(loginResult !== null){
        let loginUrl: string = loginResult[1];

        loginedAxios = axios.create({
            headers: {
                'cookie': response.headers['set-cookie']
            },
            transformRequest: [
                (data, header) => {
                    console.log(header);
                }
            ]
        });

        let loginPageRes = await loginedAxios.get(loginUrl),
            loginPageData: string = loginPageRes.data,
            loginMatchRes = loginPageData.match(qrCodeReg);

        if(loginMatchRes === null){
            console.error('无法获取登录二维码！');
            return;
        }

        console.error('请使用微信扫描弹出的二维码登录！');
        openUrl(`https://open.weixin.qq.com${loginMatchRes[1]}`);
        
        await readStdIn('确保登录成功后再按回车继续...');

        await main(loginedAxios);
        return;
    }

    console.log(pageData);
}
main();