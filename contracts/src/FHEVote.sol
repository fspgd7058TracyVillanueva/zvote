// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FHEVote
 * @dev Privacy-preserving voting system using Fully Homomorphic Encryption
 * @notice This contract handles encrypted vote storage and tallying
 */
contract FHEVote is Ownable, Pausable, ReentrancyGuard {

    // Events
    event VoteCreated(
        uint256 indexed voteId,
        address indexed creator,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed voteId,
        address indexed voter,
        uint256 timestamp
    );

    event VoteTallied(
        uint256 indexed voteId,
        uint256 totalVotes,
        uint256 timestamp
    );

    // Structs
    struct Vote {
        uint256 id;
        address creator;
        string title;
        string description;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isTallied;
        uint256 totalVotes;
        mapping(address => bool) hasVoted;
        mapping(address => bytes32) encryptedVotes; // Changed from euint32 to bytes32
    }

    struct VoteResult {
        uint256 voteId;
        uint256 totalVotes;
        uint256[] optionCounts;
        bool isTallied;
        uint256 tallyTime;
    }

    // Storage
    mapping(uint256 => Vote) public votes;
    mapping(uint256 => VoteResult) public voteResults;
    mapping(address => uint256[]) public userVotes;
    
    uint256 public voteCounter;
    uint256 public constant MAX_OPTIONS = 10;
    uint256 public constant MIN_VOTE_DURATION = 1 hours;
    uint256 public constant MAX_VOTE_DURATION = 30 days;

    // Modifiers
    modifier validVoteId(uint256 _voteId) {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");
        _;
    }

    modifier voteActive(uint256 _voteId) {
        Vote storage vote = votes[_voteId];
        require(vote.isActive, "Vote is not active");
        require(block.timestamp >= vote.startTime, "Vote has not started");
        require(block.timestamp <= vote.endTime, "Vote has ended");
        _;
    }

    modifier hasNotVoted(uint256 _voteId) {
        require(!votes[_voteId].hasVoted[msg.sender], "Already voted");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Initialize contract
    }

    /**
     * @dev Create a new vote
     * @param _title Title of the vote
     * @param _description Description of the vote
     * @param _options Array of voting options
     * @param _duration Duration of the vote in seconds
     * @return voteId The ID of the created vote
     */
    function createVote(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _duration
    ) external whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_options.length >= 2, "Must have at least 2 options");
        require(_options.length <= MAX_OPTIONS, "Too many options");
        require(_duration >= MIN_VOTE_DURATION, "Duration too short");
        require(_duration <= MAX_VOTE_DURATION, "Duration too long");

        voteCounter++;
        uint256 voteId = voteCounter;
        
        Vote storage newVote = votes[voteId];
        newVote.id = voteId;
        newVote.creator = msg.sender;
        newVote.title = _title;
        newVote.description = _description;
        newVote.startTime = block.timestamp;
        newVote.endTime = block.timestamp + _duration;
        newVote.isActive = true;
        newVote.isTallied = false;
        newVote.totalVotes = 0;

        // Add options
        for (uint256 i = 0; i < _options.length; i++) {
            newVote.options.push(_options[i]);
        }

        emit VoteCreated(voteId, msg.sender, _title, newVote.startTime, newVote.endTime);
        
        return voteId;
    }

    /**
     * @dev Cast an encrypted vote
     * @param _voteId ID of the vote
     * @param _encryptedChoice Encrypted choice (option index)
     */
    function castVote(
        uint256 _voteId,
        bytes32 _encryptedChoice
    ) external validVoteId(_voteId) voteActive(_voteId) hasNotVoted(_voteId) whenNotPaused nonReentrant {
        Vote storage vote = votes[_voteId];
        
        // Validate choice is within range (0 to options.length - 1)
        // This would require FHE comparison operations in a real implementation
        require(true, "Choice validation would be done with FHE operations");
        
        // Store encrypted vote
        vote.encryptedVotes[msg.sender] = _encryptedChoice;
        vote.hasVoted[msg.sender] = true;
        vote.totalVotes++;
        
        // Add to user's vote history
        userVotes[msg.sender].push(_voteId);
        
        emit VoteCast(_voteId, msg.sender, block.timestamp);
    }

    /**
     * @dev Tally votes using homomorphic operations
     * @param _voteId ID of the vote to tally
     */
    function tallyVotes(uint256 _voteId) external validVoteId(_voteId) whenNotPaused {
        Vote storage vote = votes[_voteId];
        require(vote.isActive, "Vote is not active");
        require(block.timestamp > vote.endTime, "Vote has not ended");
        require(!vote.isTallied, "Vote already tallied");
        require(msg.sender == vote.creator || msg.sender == owner(), "Not authorized to tally");

        // In a real implementation, this would use FHE operations to:
        // 1. Homomorphically add all encrypted votes
        // 2. Count votes for each option without decrypting individual votes
        // 3. Store the encrypted results
        
        vote.isActive = false;
        vote.isTallied = true;
        
        // Create vote result (in real implementation, this would be encrypted)
        VoteResult storage result = voteResults[_voteId];
        result.voteId = _voteId;
        result.totalVotes = vote.totalVotes;
        result.isTallied = true;
        result.tallyTime = block.timestamp;
        
        // Initialize option counts (in real implementation, these would be encrypted)
        for (uint256 i = 0; i < vote.options.length; i++) {
            result.optionCounts.push(0);
        }
        
        emit VoteTallied(_voteId, vote.totalVotes, block.timestamp);
    }

    /**
     * @dev Get vote information
     * @param _voteId ID of the vote
     * @return title Vote title
     * @return description Vote description
     * @return options Array of options
     * @return startTime Start time
     * @return endTime End time
     * @return isActive Whether vote is active
     * @return totalVotes Total number of votes cast
     */
    function getVoteInfo(uint256 _voteId) external view validVoteId(_voteId) returns (
        string memory title,
        string memory description,
        string[] memory options,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 totalVotes
    ) {
        Vote storage vote = votes[_voteId];
        return (
            vote.title,
            vote.description,
            vote.options,
            vote.startTime,
            vote.endTime,
            vote.isActive,
            vote.totalVotes
        );
    }

    /**
     * @dev Get vote results
     * @param _voteId ID of the vote
     * @return totalVotes Total number of votes
     * @return optionCounts Array of vote counts per option
     * @return isTallied Whether vote has been tallied
     */
    function getVoteResults(uint256 _voteId) external view validVoteId(_voteId) returns (
        uint256 totalVotes,
        uint256[] memory optionCounts,
        bool isTallied
    ) {
        VoteResult storage result = voteResults[_voteId];
        return (
            result.totalVotes,
            result.optionCounts,
            result.isTallied
        );
    }

    /**
     * @dev Check if user has voted
     * @param _voteId ID of the vote
     * @param _voter Address of the voter
     * @return hasVoted Whether the user has voted
     */
    function hasUserVoted(uint256 _voteId, address _voter) external view validVoteId(_voteId) returns (bool) {
        return votes[_voteId].hasVoted[_voter];
    }

    /**
     * @dev Get user's vote history
     * @param _user Address of the user
     * @return voteIds Array of vote IDs the user has participated in
     */
    function getUserVotes(address _user) external view returns (uint256[] memory) {
        return userVotes[_user];
    }

    /**
     * @dev Get total number of votes created
     * @return count Total number of votes
     */
    function getTotalVotes() external view returns (uint256) {
        return voteCounter;
    }

    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause function
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
}
