// Import Company
import CompanyElysionIcon from '../../assets/nikke/images/icons/NikkeCompanyElysion.png';
import CompanyMissilisIcon from '../../assets/nikke/images/icons/NikkeCompanyMissilis.png';
import CompanyTetraIcon from '../../assets/nikke/images/icons/NikkeCompanyTetra.png';
import CompanyPilgrimIcon from '../../assets/nikke/images/icons/NikkeCompanyPilgrim.png';
import CompanyAbnormalIcon from '../../assets/nikke/images/icons/NikkeCompanyAbnormal.png';
// Import Weapon
import WeaponARIcon from '../../assets/nikke/images/icons/NikkeWeaponAR.png';
import WeaponMGIcon from '../../assets/nikke/images/icons/NikkeWeaponMG.png';
import WeaponRLIcon from '../../assets/nikke/images/icons/NikkeWeaponRL.png';
import WeaponSGIcon from '../../assets/nikke/images/icons/NikkeWeaponSG.png';
import WeaponSMGIcon from '../../assets/nikke/images/icons/NikkeWeaponSMG.png';
import WeaponSRIcon from '../../assets/nikke/images/icons/NikkeWeaponSR.png';
// Import Class
import ClassAtkIcon from '../../assets/nikke/images/icons/NikkeClassAttacker.png';
import ClassDefIcon from '../../assets/nikke/images/icons/NikkeClassDefender.png';
import ClassSptIcon from '../../assets/nikke/images/icons/NikkeClassSupporter.png';
// Import (Nikke) Code
import CodeElectricIcon from '../../assets/nikke/images/icons/NikkeCodeElectric.png';
import CodeFireIcon from '../../assets/nikke/images/icons/NikkeCodeFire.png';
import CodeIronIcon from '../../assets/nikke/images/icons/NikkeCodeIron.png';
import CodeWaterIcon from '../../assets/nikke/images/icons/NikkeCodeWater.png';
import CodeWindIcon from '../../assets/nikke/images/icons/NikkeCodeWind.png';
// Import Burst
import Burst1Icon from '../../assets/nikke/images/icons/NikkeBurst1.png';
import Burst1RIcon from '../../assets/nikke/images/icons/NikkeBurst1R.png';
import Burst2Icon from '../../assets/nikke/images/icons/NikkeBurst2.png';
import Burst2RIcon from '../../assets/nikke/images/icons/NikkeBurst2R.png';
import Burst3Icon from '../../assets/nikke/images/icons/NikkeBurst3.png';
import BurstVIcon from '../../assets/nikke/images/icons/NikkeBurstV.png';
import BurstRIcon from '../../assets/nikke/images/icons/NikkeBurstR.png';
// Import Burst Cooldown Underlays
import BurstCooldown20Icon from '../../assets/nikke/images/icons/NikkeBurstCooldown20.png';
import BurstCooldown40Icon from '../../assets/nikke/images/icons/NikkeBurstCooldown40.png';
import BurstCooldown60Icon from '../../assets/nikke/images/icons/NikkeBurstCooldown60.png';
// Import Favorite Item
import FavAbleIcon from '../../assets/nikke/images/icons/NikkeFavAble.png';
import FavBoostedIcon from '../../assets/nikke/images/icons/NikkeFavBoosted.png';

// Import Base and the Highlight Overlay
import BlankIcon from '../../assets/nikke/images/icons/NikkeIconBase.png';
import HighlightIcon from '../../assets/nikke/images/icons/NikkeIconHighlight.png';

// Import Nikke Data for getting portrait images
import NikkeData from '../../assets/nikke/data/NikkeData.json';

/**
 * Constant collection of icons
 */
const icons = {
    'Burst': {
        '1': Burst1Icon,
        '2': Burst2Icon,
        '3': Burst3Icon,
        '1R': Burst1RIcon,
        '2R': Burst2RIcon,
        'R': BurstRIcon,
        'V': BurstVIcon
    },
    'Burst Cooldown': {
        '20': BurstCooldown20Icon,
        '40': BurstCooldown40Icon,
        '60': BurstCooldown60Icon
    },
    'Class': {
        'Attacker': ClassAtkIcon,
        'Defender': ClassDefIcon,
        'Supporter': ClassSptIcon
    },
    'Code': {
        'Electric': CodeElectricIcon,
        'Fire': CodeFireIcon,
        'Iron': CodeIronIcon,
        'Water': CodeWaterIcon,
        'Wind': CodeWindIcon
    },
    'Company': {
        'Elysion': CompanyElysionIcon,
        'Missilis': CompanyMissilisIcon,
        'Tetra': CompanyTetraIcon,
        'Abnormal': CompanyAbnormalIcon,
        'Pilgrim': CompanyPilgrimIcon
    },
    'Weapon': {
        'AR': WeaponARIcon,
        'MG': WeaponMGIcon,
        'RL': WeaponRLIcon,
        'SG': WeaponSGIcon,
        'SMG': WeaponSMGIcon,
        'SR': WeaponSRIcon
    },
    'FavItem': {
        'favAble': FavAbleIcon,
        'favBoosted': FavBoostedIcon
    },
    'Blank': BlankIcon,
    'Highlight': HighlightIcon
};
export { icons as Icons };

/**
 * Dynamically imports image assets using paths created by Nikke Names to get their portraits.
 * @returns Dictionary of image assets for Nikke portraits
 */
function getNikkePortraits() {
    let nikkePortraits = {};
    let imgContext = require.context('../../assets/nikke/images/portraits', true);

    NikkeData.forEach(nikke => {
        let name = nikke.Name.replace(':', '');

        try {
            let image = imgContext(`./${name}.png`);

            nikkePortraits = {
                ...nikkePortraits,
                [nikke.Name]: image
            };
        } catch (error) {
            console.log('Missing Portrait asset for ', name);
        }
    });

    return nikkePortraits;
}
export { getNikkePortraits };