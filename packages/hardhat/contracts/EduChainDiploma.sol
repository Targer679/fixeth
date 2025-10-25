// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EduChainDiploma is ERC721, AccessControl {
    uint256 private _nextTokenId = 1;
    
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
    struct DiplomaMetadata {
        string holderName;
        string institution;
        string degree;
        string major;
        uint256 issueDate;
        uint256 graduationDate;
        string ipfsHash;
    }
    
    mapping(uint256 => DiplomaMetadata) public diplomas;
    
    event DiplomaIssued(
        uint256 indexed tokenId,
        address indexed to,
        string holderName,
        string institution,
        string ipfsHash
    );
    
    event DiplomaVerified(uint256 indexed tokenId, address verifier);

    constructor() ERC721("EduChainDiploma", "EDU") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }
    
    function issueDiploma(
        address recipient,
        string memory holderName,
        string memory institution,
        string memory degree,
        string memory major,
        uint256 graduationDate,
        string memory ipfsHash
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;
        
        _mint(recipient, newTokenId);
        
        diplomas[newTokenId] = DiplomaMetadata({
            holderName: holderName,
            institution: institution,
            degree: degree,
            major: major,
            issueDate: block.timestamp,
            graduationDate: graduationDate,
            ipfsHash: ipfsHash
        });
        
        emit DiplomaIssued(newTokenId, recipient, holderName, institution, ipfsHash);
        return newTokenId;
    }
    
    function verifyDiploma(uint256 tokenId) external returns (bool) {
        require(_exists(tokenId), "Diploma does not exist");
        emit DiplomaVerified(tokenId, msg.sender);
        return true;
    }
    
    function getDiploma(uint256 tokenId) external view returns (
        string memory holderName,
        string memory institution,
        string memory degree,
        string memory major,
        uint256 issueDate,
        uint256 graduationDate,
        string memory ipfsHash
    ) {
        require(_exists(tokenId), "Diploma does not exist");
        DiplomaMetadata memory diploma = diplomas[tokenId];
        return (
            diploma.holderName,
            diploma.institution,
            diploma.degree,
            diploma.major,
            diploma.issueDate,
            diploma.graduationDate,
            diploma.ipfsHash
        );
    }
    
    function getDiplomaOwner(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "Diploma does not exist");
        return ownerOf(tokenId);
    }
    
    function addIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, issuer);
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, AccessControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}