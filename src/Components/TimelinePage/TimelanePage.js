import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PostCard from './PostCard';
import { getPost, getLikes, getFollows } from '../../services/linktrAPI';
import SubmitBox from './SubmitBox';
import HashtagList from './HashtagsList';
import NewPostNotification from './NewPostsNotification';
import InfiniteScroll from 'react-infinite-scroller';

export default function TimelinePage() {
	const [posts, setPosts] = useState([]);
	const [message, setMessage] = useState('Loading...');
	const [rerender, setRerender] = useState(false);
	const [more, setMore] = useState(true)
	


	function hasMore(offset, item) {
		if(offset !== 0 && item.length === 0){
			setMore(false)
			
		}
	}

	function loadData() {
		const promise2 = getLikes();
		const promise3 = getFollows(); //retorna array com ids dos usuarios seguidos pelo user
		let likes = [];
		let postsLike = [];
		let postsNoLike = [];
		let followsHash = {};
		let followedPosts = [];
		const offset = posts.length

		promise2
			.then((res) => {
				likes = res.data;
			})
			.catch((err) => console.log('likes not available'));

		promise3
			.then((res) => { for (let i=0; i < res.data.length; i++) {
				followsHash[res.data[i].profileUserId] = true;
			}
			console.log(followsHash)
			});

		function fetchData() {
			const promise1 = getPost(offset);
			promise1
				.then((res) => {
					postsNoLike = res.data;
					for (let i=0; i < postsNoLike.length; i++) {
						if (followsHash[postsNoLike[i].userId]) {
							followedPosts.push(postsNoLike[i]);
						}
					}

					if (likes.length !== 0) {
						for (let i = 0; i < followedPosts.length; i++) {
							for (let j = 0; j < likes.length; j++) {
								if (followedPosts[i].id === likes[j].postId) {
									const newItem = { ...followedPosts[i], liked: true };
									postsLike.push(newItem);
									break;
								}

								if (j === likes.length - 1) {
									const newItem = { ...followedPosts[i], liked: false };
									postsLike.push(newItem);
								}
							}
						}
					} else {
						for (let i = 0; i < followedPosts.length; i++) {
							const newItem = { ...followedPosts[i], liked: false };
							postsLike.push(newItem);
						}
					}
					console.log("has more")
					console.log(offset)
					console.log(more)
					console.log(posts.length)
					hasMore(offset, res.data)
					setPosts([...posts, ...postsLike]);
					if (posts.length < 1) {
						setMessage('There are no post yet');
					}
				})
				.catch((err) => {
					setMessage(
						'An error occured while trying to fetch the posts, please refresh the page'
					);
				});
		}
		setTimeout(fetchData, 300);
	}


	useEffect(() => {

		const promise2 = getLikes();
		const promise3 = getFollows(); //retorna array com ids dos usuarios seguidos pelo user
		let likes = [];
		let postsLike = [];
		let postsNoLike = [];
		let followsHash = {};
		let followedPosts = [];

		promise2
			.then((res) => {
				likes = res.data;
			})
			.catch((err) => console.log('likes not available'));

		promise3
		.then((res) => { for (let i=0; i < res.data.length; i++) {
			followsHash[res.data[i].followedUserId] = true;
		}
		});

		function fetchData() {

					postsNoLike = posts;

					for (let i=0; i < postsNoLike.length; i++) {
						if (followsHash[postsNoLike[i].userId]) {
							followedPosts.push(postsNoLike[i]);
						}
					}

					if (likes.length !== 0) {
						for (let i = 0; i < followedPosts.length; i++) {
							for (let j = 0; j < likes.length; j++) {
								if (followedPosts[i].id === likes[j].postId) {
									const newItem = { ...followedPosts[i], liked: true };
									postsLike.push(newItem);
									break;
								}

								if (j === likes.length - 1) {
									const newItem = { ...followedPosts[i], liked: false };
									postsLike.push(newItem);
								}
							}
						}
					} else {
						for (let i = 0; i < followedPosts.length; i++) {
							const newItem = { ...followedPosts[i], liked: false };
							postsLike.push(newItem);
						}
					}
					setPosts(postsLike);
					if (posts.length < 1) {
						setMessage('There are no post yet');
					}
				
		}
		setTimeout(fetchData, 300);
	}, [rerender]);
		
	return (
		<>
			<Container>
				<div className="content">
					<h1>timeline</h1>
					<SubmitBox
						setPosts={setPosts}
						setMessage={setMessage}
						posts={posts}
						rerender={rerender}
						setRerender={setRerender}
					/>
          
					<NewPostNotification lastPostRendered = {posts[0]}/>
          
					<InfiniteScroll
					loadMore={loadData}
              		hasMore={more}
					>
          
					{posts.length === 0 ? (
						<h6>{message}</h6>
					) : (
						posts.map((item, index) => (
							<PostCard
								key={item.id}
								id={item.id}
								userImg={item.image}
								name={item.name}
								text={item.content}
								urlInfos={item.urlInfos}
								liked={item.liked}
								rerender={rerender}
								setRerender={setRerender}
								posts={posts}
								setMessage={setMessage}
								userId={item.userId}
							/>
						))
					)}
					</InfiniteScroll>
					{more ? <></> : <h6>Yay! You have seen it all</h6>}
				</div>
				<HashtagList />
			</Container>
		</>
	);
}

const Container = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	margin-top: 125px;
	

	.content {
		width: 611px;
	}

	h1 {
		font-family: 'Oswald', sans-serif;
		font-style: normal;
		font-weight: 700;
		font-size: 43px;
		line-height: 64px;
		color: #ffffff;
		margin-bottom: 43px;
	}

	h6 {
		margin-bottom: 30px;
		font-style: normal;
		font-weight: 400;
		font-size: 19px;
		line-height: 23px;
		color: #ffffff;
		word-break: break-word;
	}

	@media (max-width: 675px) {
		margin-top: 146px;

		.content {
			width: 100%;
		}
		h1 {
			margin-left: 17px;
		}
		h6 {
			margin-left: 17px;
		}
	}
`;
