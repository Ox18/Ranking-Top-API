type IGlobal = {
    rank: number;
    is_global: boolean;
}
type ITop = {
    rank: number;
    is_top: boolean;
}
type IData = {
    start: number;
    end: number;
    rank: number;
}
type IUser = {
    rank: number;
    gp: number;
    position: number;
}
type IServer = {
    numberOfAccounts: number;
}
type IResponse = {
    rank: number;
    is_change: boolean;
}
class Ranking{
    protected ruler: number[];
    protected rankMaxTop: number;
    protected limitGP: number[];
    protected rankMaxGlobal: number;
    constructor(){
        this.ruler = [0.1,1,3,6,12,20,32,46,62,80,100];
        this.rankMaxTop = 21;
        this.rankMaxGlobal = 10;
        this.limitGP = [6900, 6000, 5100, 4200, 3500, 2800, 2300, 1800, 1500, 1200, 1100, -10E30];
    }   
}
class RankingTopModel extends Ranking{
    protected getPercent(percent:number, rest: number){
        return Math.round(percent * (rest / 100))
    }
    protected getLimits(countOfUsers:number):number[]{
        let rest = countOfUsers;
        let counts: number[] = [];
        this.ruler.map(data => (counts.push(this.getPercent(data, rest)), rest-= this.getPercent(data, rest)));
        return counts;
    }
    protected getCleanLimits(countOfUsers: number):IData[]{
        let init = 1;
        let rank = this.rankMaxTop;
        let counts:IData[] = [];
        this.getLimits(countOfUsers).map((nextAccounts)=>{
            let sumAccounts:number = init + nextAccounts;
            let data:IData = {
                start: (sumAccounts - nextAccounts),
                end: (sumAccounts - 1),
                rank: rank
            };
            counts.push(data);
            init += nextAccounts;
            rank--;
        });
        return counts;
    }
    getRank(user:IUser, server:IServer):ITop{
        let topObj:ITop = {
            rank: user.rank,
            is_top: false,
        };
        this.getCleanLimits(server.numberOfAccounts).map((data)=>{
            if(data.start >= user.position && data.end <= user.position){
                let tempRank = data.rank;
                if(user.position == 1) tempRank = 24;
                else if(user.position >= 2 && user.position <= 5) tempRank = 23;
                else if(user.position >= 6 && user.position <= 21) tempRank = 22;
                topObj.rank = tempRank;
                topObj.is_top = true;
            }
        });
        return topObj;
    }
}
class RankingGlobalModel extends Ranking{
    protected getLimits():IData[]{
        let rp:IData[] = [];
        for(let pointer in this.limitGP){
            let point = parseInt(pointer);
            if(point != (this.limitGP.length - 1)){
                let data:IData = {
                    start: this.limitGP[point] - 1,
                    end: this.limitGP[point + 1],
                    rank: this.rankMaxGlobal - point,
                };
                rp.push(data);
            }
        }      
        return rp;
    }
    getRank(user:IUser, server:IServer):IGlobal{
        let globalObj:IGlobal = {
            rank: user.rank,
            is_global: false,
        };
        this.getLimits().map((data)=>{
            if(data.start <= user.gp && data.end >= user.gp) (globalObj.rank = data.rank, globalObj.is_global = true);
        });
        return globalObj;
    }
}
const rankingTopModel = new RankingTopModel();
const rankingGlobalModel = new RankingGlobalModel();

class RankModel{
    protected isSpecial(user:IUser):boolean{
        return user.rank >= 26;
    }
    protected isChange(user:IUser, response:IResponse){
        return user.rank != response.rank;
    }
    getRank(user:IUser, server:IServer):IResponse{
        let responseObj:IResponse = {
            rank: user.rank,
            is_change: false
        }
        if(!this.isSpecial(user)){
            let globalObj = rankingGlobalModel.getRank(user, server);
            if(globalObj.is_global) responseObj.rank = globalObj.rank
            else responseObj.rank = (rankingTopModel.getRank(user, server)).rank
        }
        responseObj.is_change = this.isChange(user, responseObj);
        return responseObj;
    }
}

const rankModel = new RankModel();

class RankController{
    getRank(user:IUser, server:IServer):IResponse{
        return rankModel.getRank(user, server);
    }
}

const rankController = new RankController();

export = rankController;