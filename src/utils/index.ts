import {BigNumber, ethers} from 'ethers';


export const deletePadZero = (hexNumber: string) => {
  if (!hexNumber) return '';
  return hexNumber.replace(/^(0x)0+((\w{4})+)$/, '$1$2');
};
export const getContract = (
  address: string,
  abi: any,
  provider: ethers.providers.JsonRpcProvider,
) => {
  return new ethers.Contract(address, abi, provider);
};