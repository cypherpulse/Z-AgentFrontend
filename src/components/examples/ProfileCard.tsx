import { ProfileCard } from "../ProfileCard";

export default function ProfileCardExample() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <ProfileCard
        address="0x1234567890abcdef"
        displayName="Alex Creator"
        handle="alexcreator"
        bio="Building the future of creator economy on Base. NFT enthusiast and Web3 developer."
        creatorCoinAddress="0xabcd"
        hasTwitter={true}
      />
    </div>
  );
}
