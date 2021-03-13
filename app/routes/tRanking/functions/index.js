"use strict";
class Top {
    constructor() {
        this.rankingGlobal = [6900, 6000, 5100, 4200, 3500, 2800, 2300, 1800, 1500, 1200, 1100];
    }
}
;
class TopModel extends Top {
    calculeRangeGlobal() {
        let rangeOfGp = [];
        for (let i in this.rankingGlobal) {
            let nn = Number(parseInt(i));
            let pointerGP = this.rankingGlobal[nn];
            if (nn == 10) {
                let data = [(pointerGP - 1), -1E300];
                rangeOfGp.push(data);
            }
            else {
                let n = nn + 1;
                let afterGP = this.rankingGlobal[n];
                let data = [(pointerGP - 1), afterGP];
                rangeOfGp.push(data);
            }
        }
        return rangeOfGp;
    }
    calculePositonOnGlobal(gpOfUser) {
        let rangeOfGp = this.calculeRangeGlobal();
        let is_global = false;
        let rankCounter = 10;
        let rankSelected = 0;
        rangeOfGp.map((gp) => {
            let gp_start = gp[0];
            let gp_end = gp[1];
            if (gpOfUser <= gp_start && gpOfUser >= gp_end) {
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
    ranking_assign(total, position) {
        let mod = [0.1, 1, 3, 6, 12, 20,
            32, 46, 62, 80, 100
        ];
        let ranking = [
            [1, 1, 24],
            [2, 5, 23],
            [6, 20, 22],
        ];
        const setRanking = (porcentaje) => {
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
        };
        const rps = (p) => {
            let result = (p / 100) * total;
            result = Math.round(result);
            return result;
        };
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
    onReadRank(gpOfUser, position, totally) {
        let { is_global, rankSelected } = this.calculePositonOnGlobal(gpOfUser);
        let rank;
        if (is_global) {
            rank = rankSelected;
        }
        else {
            rank = this.ranking_assign(totally, position);
        }
        return rank;
    }
}
;
const topModel = new TopModel();
class TopController {
    getRank(top) {
        return topModel.onReadRank(top.gp, top.position, top.numberOfAccounts);
    }
}
const topController = new TopController();
module.exports = topController;
//# sourceMappingURL=index.js.map