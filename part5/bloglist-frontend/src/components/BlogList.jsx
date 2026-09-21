import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    <ul>
      {blogs.map((blog) => (
        <li className="blog" key={blog.id}>
          <Link to={'/blogs/' + blog.id}>
            {blog.title} {blog.author}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default BlogList
