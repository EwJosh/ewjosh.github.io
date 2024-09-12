// Import Company
import CompanyElysionIcon from '../../assets/images/Nikke/icons/NikkeCompanyElysion.png';
import CompanyMissilisIcon from '../../assets/images/Nikke/icons/NikkeCompanyMissilis.png';
import CompanyTetraIcon from '../../assets/images/Nikke/icons/NikkeCompanyTetra.png';
import CompanyPilgrimIcon from '../../assets/images/Nikke/icons/NikkeCompanyPilgrim.png';
import CompanyAbnormalIcon from '../../assets//images/Nikke/icons/NikkeCompanyAbnormal.png';
// Import Weapon
import WeaponARIcon from '../../assets/images/Nikke/icons/NikkeWeaponAR.png';
import WeaponMGIcon from '../../assets/images/Nikke/icons/NikkeWeaponMG.png';
import WeaponRLIcon from '../../assets/images/Nikke/icons/NikkeWeaponRL.png';
import WeaponSGIcon from '../../assets/images/Nikke/icons/NikkeWeaponSG.png';
import WeaponSMGIcon from '../../assets/images/Nikke/icons/NikkeWeaponSMG.png';
import WeaponSRIcon from '../../assets/images/Nikke/icons/NikkeWeaponSR.png';
// Import Class
import ClassAtkIcon from '../../assets/images/Nikke/icons/NikkeClassAttacker.png';
import ClassDefIcon from '../../assets/images/Nikke/icons/NikkeClassDefender.png';
import ClassSptIcon from '../../assets/images/Nikke/icons/NikkeClassSupporter.png';
// Import (Nikke) Code
import CodeElectricIcon from '../../assets/images/Nikke/icons/NikkeCodeElectric.png';
import CodeFireIcon from '../../assets/images/Nikke/icons/NikkeCodeFire.png';
import CodeIronIcon from '../../assets/images/Nikke/icons/NikkeCodeIron.png';
import CodeWaterIcon from '../../assets/images/Nikke/icons/NikkeCodeWater.png';
import CodeWindIcon from '../../assets/images/Nikke/icons/NikkeCodeWind.png';
// Import Burst
import Burst1Icon from '../../assets/images/Nikke/icons/NikkeBurst1.png';
import Burst1RIcon from '../../assets/images/Nikke/icons/NikkeBurst1R.png';
import Burst2Icon from '../../assets/images/Nikke/icons/NikkeBurst2.png';
import Burst3Icon from '../../assets/images/Nikke/icons/NikkeBurst3.png';
import BurstVIcon from '../../assets/images/Nikke/icons/NikkeBurstV.png';

// Import Base and Overlay
import BlankIcon from '../../assets/images/Nikke/icons/NikkeIconBase.png';
import HighlightIcon from '../../assets/images/Nikke/icons/NikkeIconHighlight.png';

// Import Nikke Data for getting avatar images
import NikkeData from '../../assets/data/NikkeData.json';

/**
 * Constant collection of icons
 */
const icons = {
    'Burst': {
        '1': Burst1Icon,
        '2': Burst2Icon,
        '3': Burst3Icon,
        '1R': Burst1RIcon,
        'V': BurstVIcon
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
    'Blank': BlankIcon,
    'Highlight': HighlightIcon
};
export { icons as Icons };

/**
 * Dynamically imports image assets using paths created by Nikke Names to get their avatars.
 * @returns Dictionary of image assets for Nikke avatars
 */
function getNikkeAvatars() {
    let nikkeAvatars = {};
    let imgContext = require.context('../../assets/images/Nikke/avatars', true);

    NikkeData.forEach(nikke => {
        let name = nikke.Name.replace(':', '');

        try {
            let image = imgContext(`./${name}.png`);
            nikkeAvatars = {
                ...nikkeAvatars,
                [nikke.Name]: image
            };
        } catch (error) {
            console.log('Missing Avatar asset for ', name);
        }
    });

    return nikkeAvatars;
}
export { getNikkeAvatars };