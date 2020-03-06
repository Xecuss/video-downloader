import child_process from 'child_process';
import os from 'os';

export default function openUrl(url: string): void{
    let plat = os.platform();

    switch(plat){
        case 'darwin': { child_process.exec(`open ${url}`); break; }
        case 'win32': { child_process.exec(`start ${url}`); break; }
    }
}
