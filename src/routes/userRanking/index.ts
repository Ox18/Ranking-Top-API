
type IData = {
    rank: number;
    is_change: boolean;
}
type IUser = {
    rank: number;
    gp: number;
    position: number;
}
type IServer = {
    numberAccounts:number;
}
class Top{
    protected globalGP:any[];
    constructor(){
        this.globalGP = [6900, 6000, 5100, 4200,3500,2800,2300, 1800, 1500,1200, 1100];
    }
}

class TopModel extends Top{
    protected calculeRangeGlobal = ()=>{
        let rangeOfGp = [];
            for(let i in this.globalGP){
                let pointerGP = this.globalGP[i];
                let nPosition:number = parseInt(i);
                if(nPosition == 10){
                    let data = [(pointerGP - 1), -1E300];
                    rangeOfGp.push(data);
                }	
                else{
                    let n = parseInt(i) + 1;
                    let afterGP = this.globalGP[n];
                    let data = [(pointerGP - 1), afterGP];
                    rangeOfGp.push(data);
                }
            }
            return rangeOfGp;
    }
    protected calculePositonOnGlobal(gpOfUser:number){
        let rangeOfGp = this.calculeRangeGlobal();
        let is_global = false;
        let rankCounter = 10;
            let rankSelected = 0;
            rangeOfGp.map((gp)=>{
                let gp_start = gp[0];
                let gp_end = gp[1];
                if(gpOfUser <= gp_start && gpOfUser >= gp_end){
                    rankSelected = rankCounter;
                    is_global = true;
                }
                rankCounter--;
            });
            let data = {
                rankSelected: rankSelected,
                is_global: is_global
            };
            return data;
    }
    protected ranking_assign(total:number, position:number){
        let mod = [0.1, 1, 3, 6, 12, 20,
            32, 46, 62, 80, 100
        ];
        let ranking = [
            [1, 1, 24],
            [2, 5, 23],
            [6, 20, 22],
        ];
        const setRanking = (porcentaje:number) => {
            let p_data = ranking[ranking.length - 1];
            let p_final = p_data[1];
            let first = p_final + 1;
            let calc = rps(porcentaje);
            let second = first + calc;
            let range = p_data[2] - 1;
            ranking.push([first,
                second,
                range
            ]);
        }
        const rps = (p:number) => {
            let result = (p / 100) * total;
            result = Math.round(result);
            return result;
        }
        mod.map((p) => {
            setRanking(p);
        });
        let rank = 0;
        ranking.map((r) => {
            if (position >= r[0] && position <= r[1]) {
                rank = r[2];
            }
        });
        return rank;
    }
    protected onReadRank(gpOfUser:number, position:number, numberAccounts:number):number{
        let { is_global, rankSelected } = this.calculePositonOnGlobal(gpOfUser);

        let rank;

        if(is_global) rank = rankSelected;
        else rank = this.ranking_assign(numberAccounts, position);
        return rank;
    }
    protected getSpecial(rank:number):boolean{
        return rank >= 26;
    }
    getRank(user:IUser, server:IServer):IData{
        let data:IData = {
            rank: user.rank,
            is_change: false
        };
        let is_special:boolean = this.getSpecial(user.rank);
        if(!is_special){
            let afterRank:number = this.onReadRank(user.gp, user.position, server.numberAccounts);
            if(user.rank != afterRank){
                data.rank = afterRank;
                data.is_change = true;
            }
        }
        return data;
    }
}
const topModel = new TopModel();
class TopController{
    getRank(user:IUser, server:IServer){
        return topModel.getRank(user, server);
    }
}

const topController = new TopController();

export = topController;